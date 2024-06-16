import { deleteSession, getSession, getUser, isLoggedIn, logOut, setSession } from "@/Components/session";
import User from "../models/User";
import sendEmail from "./sendEmail";
import moment from "moment";
import mongoose from 'mongoose'

import momentTz from 'moment-timezone';
import bcrypt from 'bcrypt'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { generate as genOtp } from 'otp-generator'

import fs from 'node:fs/promises'

import { writeFileSync, createReadStream } from 'node:fs'
import path from "node:path";
import { randomUUID } from "node:crypto";
import { uploadFile } from "@/utils/uploadFile";
import { getImage } from "./getFile";
import Ministry from "../models/Ministry";
import upload from "./upload";
import History from "../models/History";
import Faith from "../models/Faith";
import Leadership from "../models/Leadership";
import { sampleData } from "@/utils/sampleData";
import Homepage from "../models/Homepage";
import GuestSpeaker from "../models/GuestSpeakers";
import BibleCharacter from "../models/BibleCharacters";
import TopicalStudy from "../models/TopicalStudy";
import Conference from "../models/Conference";
import LiveLink from "../models/LiveLink";
import ResourceMinistry from "../models/ResourceMinistry";
import Hero from "../models/Hero";
import Header from "../models/Header";
import Schedule from "../models/Schedule";
import generateFileUrl from "@/utils/getImageUrl";
import Resource from "../models/Resource";
import Location from "../models/Location";
import PrayerRequestTopic from "../models/PrayerRequestTopic";
import ContactForm from "../models/ContactForm";
import Message from "../models/Message";
import Meta from "../models/Meta";
import Footer from "../models/Footer";
import { FormatQuoteRounded } from "@mui/icons-material";
import ContactEmail from "../models/ContactEmail";
import s3 from "@/utils/s3Util";

const initialPath = process.env.NODE_ENV === 'production' ? '/tmp' : process.cwd();

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
}

const generateOtp = () => {
    return genOtp(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false, specialChars: false
    });
}

const saveFile = async ({ folder, fileArray }) => {
    //Array of object: {filename:name, filedata:data}

    return mkdirp(path.join(initialPath, 'files', folder,)).then((made) => {
        return fileArray.map(async (fileObj) => {
            const filename = fileObj.filename;
            const filedata = fileObj.filedata;

            const data = await filedata.arrayBuffer();
            const buffer = Buffer.from(data);

            const saveFileIn = path.join(initialPath, 'files', folder, filename);


            writeFileSync(saveFileIn, buffer)
        })
    })
}

const fetchFile = async ({ filePath }) => {
    const buffer = await fs.readFile(filePath);

    if (buffer)
        return buffer
}

const deleteFile = async ({ filePath }) => {
    return await fs.unlink(filePath);
}

const getImageFromArray = (source) => {
    const key = Object.keys(source ?? {})[0]
    return { filename: key, file: source[key] }
}

export async function handleCheckLoginStatus(searchParams) {
    const loggedIn = await isLoggedIn()
    return { result: loggedIn };
}

export async function handleLogOut(searchParams) {
    const loggedOut = await logOut()
    return { result: loggedOut };
}

export async function handleLogin(searchParams) {
    const designation = await isLoggedIn()

    if (designation) {
        //user is already logged in. Just return true to say that login succeeded. 
        //No need telling the user that they are already logged in 
        return { result: designation }
    }
    else {
        const email = searchParams.get('email')
        const password = searchParams.get('password')

        //Get the password hash for this email the password
        const userData = await User.findOne({ email: email });

        const match = await bcrypt.compare(password, userData?.password);

        if (match) {
            //The password matches what the user has. Go ahead and load the user in
            const done = await setSession({
                email: email, fullName: userData?.fullName, id: userData?._id,
                profilePicture: userData?.profilePicture, designation: userData?.designation
            });

            return { result: done }
        }
        else {
            //The password does not match 
            return { result: false }
        }
    }

}

export async function handleRegister(searchParams) {
    const designation = await isLoggedIn()

    if (designation) {
        //user is already logged in. Just return true to say that login succeeded. 
        //No need telling the user that they are already logged in 
        return { result: designation }
    }
    else {
        const email = searchParams.get('email')
        const password = searchParams.get('password')
        const fullName = searchParams.get('fullName')
        const phone = searchParams.get('phone')

        //Get the password hash for this email the password
        const userData = await User.findOne({ email: email });

        if (userData) {
            return { error: 'Email already exists' }
        }
        else {
            const hash = await bcrypt.hash(password, Number(process.env.SALT));

            const user = User({ email: email, password: hash, phone: phone, fullName: fullName, designation: 'user' })

            const done = await user.save()

            if (done) {
                await setSession({
                    email: email, fullName: fullName,
                    profilePicture: '', designation: 'user'
                });

                return { result: 'logged in' };
            }
            else {
                return { error: 'Something went wrong' };
            }
        }

    }

}

export async function handleTokenRequest(searchParams, email) {
    email = email ?? searchParams.get('email')
    //Check if email exists
    const emailExists = await User.findOne({ email });

    if (emailExists) {
        const token = randomUUID().substring(0, 30).replace('-', '') //generateOtp()
        const link = `${process.env.SITE_URL}/new-password?token=${token}`

        const emailPayload = {
            from: `Password Reset <${process.env.NOREPLY_EMAIL}>`,
            emailPassword: process.env.NOREPLY_EMAIL_PASSWORD,
            to: email,
            fromEmail: process.env.NOREPLY_EMAIL,
            to: email,
            subject: 'Reset password',
            text: `Kindly follow this link to reset your password ${link}`,
            html: `<p>Hi</p><p>Kindly follow this link to reset your password ${link}</p>`
        };

        const emailSent = await sendEmail({
            toEmail: emailPayload.to, fromHeading: emailPayload.from, password: emailPayload.emailPassword,
            subject: emailPayload.subject, text: emailPayload.text, html: emailPayload.html,
            fromEmail: emailPayload.fromEmail
        })

        if (emailSent !== null) {
            //save the token in session 
            const done = await setSession({ token, email: email }, 'token')
            return { result: done }
        }
    }
    else {
        return { error: 'Something went wrong. Try again later' }
    }
}

export async function handleVerifyToken(searchParams) {
    const token = searchParams.get('token');
    const realToken = await getSession('token');

    if (realToken?.token?.toString() === token) {
        await deleteSession(['token']);

        //Set a flag that shows a user is ready for password change
        const markerSet = await setSession({ email: realToken?.email }, 'passwordChangeMarker')

        return { result: markerSet };
    }
    else {
        return { result: false };
    }
}

export async function resendToken(searchParams) {
    const TokenObject = await getSession('token');

    const sent = await handleTokenRequest(null, TokenObject.email);

    return sent
}

export async function changePassword(searchParams) {
    const marker = await getSession('passwordChangeMarker');

    if (!marker?.email) {
        //User has not been auhenticated for password change
        return { result: false }
    }
    else {
        //User has been authenticated for password change. Go ahead with the change
        const password = searchParams.get('password');
        const salt = Number(process.env.SALT)

        const passwordHash = await bcrypt.hash(password, salt);

        const modified = await User.updateOne({ email: marker.email }, { $set: { password: passwordHash } })

        //Clean up:
        //delete the passwordChangeMarker cookie
        if (modified) {
            const done = await deleteSession(['passwordChangeMarker']);

            return { result: done || true }
        }
        else {
            return { result: false }
        }
    }
}

export async function checkEmail(searchParams) {
    const email = searchParams.get('email');

    const existingUsers = await User.findOne({ email: email }).select({ _id: 1 })

    return { result: Boolean(existingUsers) }
}

export async function getImageURL(searchParams) {
    const name = searchParams.get('name')

    const data = await getImage({ filePath: name })

    if (data) {
        return { result: data.Body, extension: name.split('.')?.reverse()[0] }
        /*  res.setHeader('Content-Type', `image/${name.split('.')?.reverse()[0]}`)
 
         res.status(200).end(); */
    }
}

export async function updateMinistry(searchParams) {
    const banner = searchParams.get('banner');
    const heroText = searchParams.get('heroText');
    const heroSubtitle = searchParams.get('heroSubtitle');
    const bodyImage = searchParams.get('bodyImage');
    const bodyTitle = searchParams.get('bodyTitle');
    const bodyDetails = searchParams.get('bodyDetails');
    const ministry = searchParams.get('ministry');

    if (banner && heroText && bodyImage && bodyTitle && bodyDetails && ministry) {
        //Save the banner
        const updateBanner = (banner instanceof Blob);

        const bannerSaved = updateBanner && await upload({ file: banner, filename: banner?.name, category: 'banner' })

        const bannerName = bannerSaved?.data?.filename

        //Save the body image
        const updateBodyImage = (bodyImage instanceof Blob);
        const bodyImageSaved = updateBodyImage && await upload({ file: bodyImage, filename: bodyImage?.name, category: 'bodyImage' });
        const bodyImageName = bodyImageSaved?.data?.filename

        //Save the data
        await Ministry.updateOne({ ministry }, {
            $set: {
                ...(updateBanner ? { banner: `banner/${bannerName}` } : {}),
                heroText, bodyTitle, bodyDetails,
                heroSubtitle,
                ...(updateBodyImage ? { bodyImage: `bodyImage/${bodyImageName}` } : {}),
            },
        }, { upsert: true })

        return { result: 'saved' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getMinistryView(searchParams) {
    const ministry = searchParams.get('ministry');

    const data = await Ministry.findOne({ ministry });

    return { result: data };
}

export async function updateHistory(searchParams) {
    const banner = searchParams.get('banner');
    const heroText = searchParams.get('heroText');
    const heroSubtitle = searchParams.get('heroSubtitle');
    const section1Image = searchParams.get('section1Image');
    const section1Heading = searchParams.get('section1Heading');
    const section1Text = searchParams.get('section1Text');
    const section2Image = searchParams.get('section2Image');
    const section2Heading = searchParams.get('section2Heading');
    const section2Text = searchParams.get('section2Text');
    const section3Image = searchParams.get('section3Image');
    const section3Heading = searchParams.get('section3Heading');
    const section3Text = searchParams.get('section3Text');
    const pageName = searchParams.get('pageName');

    if (banner && heroText && section1Heading && section1Image && section1Text && section2Heading && section2Image
        && section2Text && section3Heading && section3Image && section3Text) {
        //Save the banner
        const updateBanner = (banner instanceof Blob);

        const bannerSaved = updateBanner && await upload({ file: banner, filename: banner?.name, category: 'banner' })

        const bannerName = bannerSaved?.data?.filename

        //Save the section 1 image
        const updateSection1Image = (section1Image instanceof Blob);
        const section1ImageSaved = updateSection1Image && await upload({ file: section1Image, filename: section1Image?.name, category: 'section1Image' });
        const section1ImageName = section1ImageSaved?.data?.filename

        //Save the section 2 image
        const updateSection2Image = (section2Image instanceof Blob);
        const section2ImageSaved = updateSection2Image && await upload({ file: section2Image, filename: section2Image?.name, category: 'section2Image' });
        const section2ImageName = section2ImageSaved?.data?.filename

        //Save the section 3 image
        const updateSection3Image = (section3Image instanceof Blob);
        const section3ImageSaved = updateSection3Image && await upload({ file: section3Image, filename: section3Image?.name, category: 'section3Image' });
        const section3ImageName = section3ImageSaved?.data?.filename

        //Save the data
        await History.updateOne({ pageName }, {
            $set: {
                ...(updateBanner ? { banner: `banner/${bannerName}` } : {}),
                heroText, section1Heading, section1Text, section2Heading, section2Text, section3Heading, section3Text,
                heroSubtitle, ...(updateSection1Image ? { section1Image: `section1Image/${section1ImageName}` } : {}),
                ...(updateSection2Image ? { section2Image: `section2Image/${section2ImageName}` } : {}),
                ...(updateSection3Image ? { section3Image: `section3Image/${section3ImageName}` } : {}),
            },
        }, { upsert: true })

        return { result: 'saved' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getHistoryView(searchParams) {

    const data = await History.findOne();


    return { result: data };
}

export async function updateFaith(searchParams) {
    const banner = searchParams.get('banner');
    const heroText = searchParams.get('heroText');
    const heroSubtitle = searchParams.get('heroSubtitle');
    const bodyImage = searchParams.get('bodyImage');
    const bodyTitle = searchParams.get('bodyTitle');
    const sections = JSON.parse(searchParams.get('sections'));
    const pageName = searchParams.get('pageName');

    if (banner && heroText && bodyImage && sections && bodyTitle) {
        //Save the banner
        const updateBanner = (banner instanceof Blob);

        const bannerSaved = updateBanner && await upload({ file: banner, filename: banner?.name, category: 'banner' })

        const bannerName = bannerSaved?.data?.filename

        //Save the bodyImage
        const updateBodyImage = (bodyImage instanceof Blob);
        const bodyImageSaved = updateBodyImage && await upload({ file: bodyImage, filename: bodyImage?.name, category: 'bodyImage' });
        const bodyImageName = bodyImageSaved?.data?.filename

        //Save the data
        await Faith.updateOne({ pageName }, {
            $set: {
                ...(updateBanner ? { banner: `banner/${bannerName}` } : {}), heroText, sections, bodyTitle,
                heroSubtitle, ...(updateBodyImage ? { bodyImage: `bodyImage/${bodyImageName}` } : {}),
            },
        }, { upsert: true })

        return { result: 'saved' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getFaithView(searchParams) {

    const data = await Faith.findOne();

    return { result: data };
}

const uploadMultipleFiles = async (fileArray, category, callback) => {
    const fileUploadedNames = {};

    const fileUploader = async (files) => {
        if (!files?.length) {
            return callback(fileUploadedNames);
        }

        const fileData = files?.pop();
        const file = fileData?.file;

        const imageSaved = await upload({ file, filename: file?.name, category: category || 'leaders' });
        const imageName = imageSaved?.data?.filename

        fileUploadedNames[fileData.id] = imageName;
        return fileUploader(files)
    }

    return await fileUploader(fileArray)
}

export async function updateLeadership(searchParams) {
    const banner = searchParams.get('banner');
    const heroText = searchParams.get('heroText');
    const heroSubtitle = searchParams.get('heroSubtitle');
    const leaders = JSON.parse(searchParams.get('leaders'));
    const pageName = searchParams.get('pageName');


    if (banner && heroText && leaders?.length) {
        //Save the banner
        const updateBanner = (banner instanceof Blob);

        const bannerSaved = updateBanner && await upload({ file: banner, filename: banner?.name, category: 'banner' })

        const bannerName = bannerSaved?.data?.filename

        //Build leaders Images
        const leadersImages = []
        const existingImages = {}
        leaders?.forEach(leader => {
            const file = searchParams.get(leader?.email);
            if (!file) return false
            if (!(file instanceof Blob)) {
                existingImages[leader?.email] = file
                return false
            }

            leadersImages.push({ file, id: leader?.email })
        })


        //Save the images of the leaders
        //  if (leadersImages?.length) {
        const result = await uploadMultipleFiles(leadersImages, 'leaders', async (uploadedImagesObject) => {
            //Save the data
            const result = await Leadership.updateOne({ pageName }, {
                $set: {
                    ...(updateBanner ? { banner: `banner/${bannerName}` } : {}), heroText,
                    heroSubtitle, leaders: leaders?.map(leader => {
                        !uploadedImagesObject[leader?.email] && delete leader.image;

                        return {
                            ...leader, /* ...(uploadedImagesObject[leader?.email]
                                ? { image: `leaders/${uploadedImagesObject[leader?.email]}` } : {}) */
                            image: uploadedImagesObject[leader?.email]
                                ? `leaders/${uploadedImagesObject[leader?.email]}`
                                : existingImages[leader?.email]
                        }
                    }),
                },
            }, { upsert: true })

            return 'saved'

        })


        return { result: 'saved' }
        //}
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getLeadershipView(searchParams) {

    const data = await Leadership.findOne();

    return { result: data };
}

export async function getAdminIndex(searchParams) {
    const rows = (await User.find()).map(i => { return { ...(i?.toObject()), id: i?._id?.toString() } });

    return { result: { rows, totalRows: 300 } };
}

export async function updateAdmin(searchParams) {
    const profilePicture = searchParams.get('profilePicture');
    const fullName = searchParams.get('fullName');
    const email = searchParams.get('email');
    const password = searchParams.get('password');
    const id = searchParams.get('_id');

    if (fullName && email && password) {
        //Check if the email already exists
        const emailExists = await User.findOne(id ? { email, _id: { $ne: id } } : { email }, { fullName });

        if (emailExists) {
            //Send the user an error message that the email has been taken
            return { error: 'This email address has been taken by another user' }
        }
        else {
            const proceed = async ({ passwordChanged }) => {
                const hash = passwordChanged && await hashPassword(password);
                //Save the banner
                const updateProfilePicture = (profilePicture instanceof Blob);

                const imageSaved = updateProfilePicture && await upload({ file: profilePicture, filename: profilePicture?.name, category: 'profilePicture' })

                const profilePictureName = imageSaved?.data?.filename

                //Save the data
                await User.updateOne(id ? { _id: id } : { email }, {
                    $set: {
                        ...(updateProfilePicture ? { profilePicture: `profilePicture/${profilePictureName}` } : {}),
                        fullName, email, ...(passwordChanged ? { password: hash } : {})
                    },
                }, { upsert: true })

                return 'saved'
            }

            if (id) {
                //Check if the password was changed
                const samePassword = await User.findOne({ _id: id, password })

                await proceed({ passwordChanged: !Boolean(samePassword) })
            }
            else {
                await proceed({ passwordChanged: true })
            }

            return { result: 'saved' }
        }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getAdminView(searchParams) {
    const id = searchParams.get('id');

    const data = await User.findOne({ _id: id });

    return { result: data };
}

export async function deleteAdmin(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    const data = await User.deleteMany({ _id: id });

    return { result: data };
}

export async function updateHomepage(searchParams) {
    const banner = searchParams.get('banner');
    const heroText = searchParams.get('heroText');
    const heroSubtitle = searchParams.get('heroSubtitle');
    const services = JSON.parse(searchParams.get('services'));
    const navigation = JSON.parse(searchParams.get('navigation'));

    const pageName = searchParams.get('pageName');

    if (banner && heroText && navigation?.length && services?.length && pageName) {
        //Save the banner
        const updateBanner = (banner instanceof Blob);

        const bannerSaved = updateBanner && await upload({ file: banner, filename: banner?.name, category: 'banner' })

        const bannerName = bannerSaved?.data?.filename

        //Build externalNavigationImages Images
        const externalNavigationImages = []
        const existingImages = {}
        navigation?.forEach(nav => {
            const file = searchParams.get(nav?.order);
            if (!file) return false
            if (!(file instanceof Blob)) {
                existingImages[nav?.order] = file
                return false
            }

            externalNavigationImages.push({ file, id: nav?.order })
        })

        const result = await uploadMultipleFiles(externalNavigationImages, 'externalNavigation',
            async (uploadedImagesObject) => {
                //Save the data
                await Homepage.updateOne({ pageName }, {
                    $set: {
                        ...(updateBanner ? { banner: `banner/${bannerName}` } : {}), heroText,
                        heroSubtitle,/*  internalNavigation, */ services,
                        navigation: navigation?.map(nav => {
                            !uploadedImagesObject[nav?.order] && delete nav.logo;

                            return {
                                ...nav, logo: uploadedImagesObject[nav?.order]
                                    ? `externalNavigation/${uploadedImagesObject[nav?.order]}`
                                    : existingImages[nav?.order]
                            }
                        }),
                    },
                }, { upsert: true })

                return 'saved'

            })


        return { result: 'saved' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getHomePageView(searchParams) {

    const data = await Homepage.findOne();

    return { result: data };
}

export async function updateGuestSpeakers(searchParams) {
    const image = searchParams.get('image');
    const name = searchParams.get('name');
    const pageName = searchParams.get('pageName');
    const id = searchParams.get('id');


    if (image && name && pageName) {
        //Save the banner
        const updateImage = (image instanceof Blob);

        const imageSaved = updateImage && await upload({ file: image, filename: image?.name, category: 'guestSpeaker' })

        const imageName = imageSaved?.data?.filename

        //Save the data
        id ? await GuestSpeaker.updateOne(id ? { _id: id } : {}, {
            $set: {
                ...(updateImage ? { image: `guestSpeaker/${imageName}` } : {}),
                name,
            },
        })
            : await GuestSpeaker.create({
                ...(updateImage ? { image: `guestSpeaker/${imageName}` } : {}),
                name, pageName: 'guestSpeaker'
            },)

        return { result: 'saved' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getGuestSpeakerView(searchParams) {
    const id = searchParams.get('id');

    const data = (await GuestSpeaker.find(id ? { _id: id } : {}))?.map(i => { return { ...i.toObject(), id: i?._id } });

    return { result: id ? data[0] : data };
}

export async function deleteSpeaker(searchParams) {
    const id = searchParams.get('id');

    const data = await GuestSpeaker.deleteMany({ _id: id });

    return { result: data };
}

export async function addBibleCharacter(searchParams) {
    const name = searchParams.get('name');
    const sectionId = searchParams.get('sectionId');
    const sectionTitle = searchParams.get('sectionTitle');
    const update = searchParams.get('update');

    if (name && sectionId) {
        const characterExists = update === 'null' && await BibleCharacter.findOne({ name, sectionId });

        if (characterExists) {
            //Send the user an error message that the bible character already exists
            return { error: 'This bible character already exists' }
        }
        else {
            update === 'null' ? await BibleCharacter.create({ name, sectionId, sectionTitle })
                : await BibleCharacter.updateOne({ name: update, sectionId }, { name, sectionId, sectionTitle });

            return { result: 'saved' }
        }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function addBibleCharacterSection(searchParams) {
    const name = searchParams.get('name');
    const id = searchParams.get('id');

    if (name) {
        const nameExists = (id === 'null') && await BibleCharacter.findOne({ name });

        if (nameExists) {
            //Send the user an error message that the bible character already exists
            return { error: 'This bible character section name already exists' }
        }
        else {
            id !== 'null' ? await BibleCharacter.updateOne({ sectionId: id }, { sectionTitle: name })
                : await BibleCharacter.create({ sectionId: randomUUID(), sectionTitle: name });

            return { result: 'saved' }
        }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function deleteBibleCharacterSection(searchParams) {
    const id = searchParams.get('id');

    if (id) {
        await BibleCharacter.deleteOne({ sectionId: id });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function deleteBibleCharacter(searchParams) {
    const id = searchParams.get('id');
    const name = searchParams.get('name');

    if (id) {
        await BibleCharacter.deleteOne({ sectionId: id, name });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getBibleCharacterView(searchParams) {

    const data = await BibleCharacter.find();


    return { result: data };
}

export async function addTopicalStudy(searchParams) {
    const sectionTitle = searchParams.get('sectionTitle');
    const id = searchParams.get('id');


    if (sectionTitle) {
        const nameExists = id === 'null' && await TopicalStudy.findOne({ sectionTitle });

        if (nameExists) {
            //Send the user an error message that the topical study already exists
            return { error: 'This topical study name already exists' }
        }
        else {
            id === 'null' ? await TopicalStudy.create({ sectionTitle })
                : await TopicalStudy.updateOne({ _id: id }, { sectionTitle });

            return { result: 'saved' }
        }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getTopicalStudyView(searchParams) {

    const data = await TopicalStudy.find();

    return { result: data };
}

export async function deleteTopicalStudy(searchParams) {
    const id = searchParams.get('id');

    if (id) {
        await TopicalStudy.deleteOne({ _id: id });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function addConferenceCategory(searchParams) {
    const name = searchParams.get('name');
    const sectionId = searchParams.get('sectionId');
    const sectionTitle = searchParams.get('sectionTitle');
    const update = searchParams.get('update');


    if (name && sectionId) {
        const nameExists = await Conference.findOne({ name, sectionId });

        if (nameExists) {
            //Send the user an error message that the bible character already exists
            return { error: 'This Category already exists in this conference' }
        }
        else {
            update === 'null' ? await Conference.create({ name, sectionId, sectionTitle }) :
                await Conference.updateOne({ sectionId, name: update }, { name });

            return { result: 'saved' }
        }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function deleteConference(searchParams) {
    const sectionId = searchParams.get('id');


    if (sectionId) {
        await Conference.deleteOne({ sectionId });
        sectionId
        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function deleteConferenceItem(searchParams) {
    const sectionId = searchParams.get('id');
    const name = searchParams.get('name');

    if (sectionId && name) {
        await Conference.deleteOne({ sectionId, name });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function addConference(searchParams) {
    const name = searchParams.get('name');
    const id = searchParams.get('id');

    if (name) {
        const nameExists = id === 'null' && await Conference.findOne({ sectionTitle: name });

        if (nameExists) {
            //Send the user an error message that the name already exists
            return { error: 'This conference name already exists' }
        }
        else {
            id === 'null' ? await Conference.create({ sectionId: randomUUID(), sectionTitle: name }) :
                await Conference.updateOne({ sectionId: id }, { sectionTitle: name });

            return { result: 'saved' }
        }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getConferenceView(searchParams) {

    const data = await Conference.find();

    return { result: data };
}

export async function addResourceMinistry(searchParams) {
    const sectionTitle = searchParams.get('sectionTitle');
    const id = searchParams.get('id');

    if (sectionTitle) {
        const nameExists = id === 'null' && await ResourceMinistry.findOne({ sectionTitle });

        if (nameExists) {
            //Send the user an error message that the topical study already exists
            return { error: 'This ministry name already exists' }
        }
        else {
            id === 'null' ? await ResourceMinistry.create({ sectionTitle }) :
                await ResourceMinistry.updateOne({ _id: id }, { sectionTitle });

            return { result: 'saved' }
        }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getResourceMinistryView(searchParams) {

    const data = await ResourceMinistry.find();

    return { result: data };
}

export async function deleteResourceMinistry(searchParams) {
    const id = searchParams.get('id');

    if (id) {
        await ResourceMinistry.deleteOne({ _id: id });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getDataForNewSchedule(searchParams) {
    const id = searchParams.get('id');

    //get all guest speakers
    const speakers = await GuestSpeaker.find()

    //Get all topics
    const topics = await TopicalStudy.find()

    //Get all bible characters
    const bibleCharacters = await BibleCharacter.find();

    const locations = (await Location.find()).map(i => { return { ...i?.toObject(), id: i?._id } });

    const liveLinks = (await LiveLink.find()).map(i => { return { ...i?.toObject(), id: i?._id } });

    //Get all conferences
    const conferences = await Conference.find();

    let existingData = null;

    if (id) {
        existingData = await Schedule.findOne({ _id: id })
    }

    return { result: { speakers, topics, bibleCharacters, liveLinks, conferences, existingData, locations } }
}

const convertTimeToUtc = ({ date, time, timeZone, type }) => {
    if (type === 'time') {
        const momentObj = momentTz.tz(`${date} ${time}`, timeZone).toString();
        const utcTime = moment(new Date(momentObj).toLocaleString('en-US', { timeZone: 'UTC' })/* , 'DD/MM/yyyy, h:mm:ss A' */).format('HH:mm')//.format('hh:mm').toString() //momentObj.local().format('hh:mm').toString()// /* momentObj */moment.utc(momentObj).format('hh:mm').toString();

        return utcTime
    }
    else if (type === 'date') {
        const momentObj = momentTz.tz(`${date}`, timeZone).toString();
        const utcTime = moment(new Date(momentObj).toLocaleString('en-US', { timeZone: 'UTC' })/* , 'DD/MM/yyyy, h:mm:ss A' */).format('yyyy-MM-DD') //momentObj.utc().format('yyyy-MM-DD').toString();

        return utcTime
    }
}

const generateDailySchedules = ({ schedule, numberOfMonths }) => {
    const todayDate = moment().format('yyyy-MM-DD').toString();
    const endDate = schedule?.endDate || moment(todayDate).add(numberOfMonths, 'months').format('yyyy-MM-DD').toString();

    const startDate = schedule?.date || todayDate;
    const numberOfDaysBetweenStartAndEnd = moment(endDate, 'yyyy-MM-DD').diff(startDate, 'days') + (schedule?.endDate ? 0 : 5);

    //Build an array of consecutive dates from the startDate
    return Array.from({ length: numberOfDaysBetweenStartAndEnd + 1 }).map((x, i) => {
        const date = moment(startDate, 'yyyy-MM-DD').add(i, 'days').format('yyyy-MM-DD').toString()
        return schedule?.duration?.map(duration => {
            return {
                ...schedule, date, duration: {
                    ...duration, time: convertTimeToUtc({
                        date: schedule?.date || todayDate, time: duration?.time,
                        timeZone: schedule?.timeZone, type: 'time'
                    })
                }
            }
        }).flat(1)/* { ...schedule, date } */
    }).flat(1)
}

const generateWeeklySchedules = ({ schedule, numberOfMonths }) => {
    const todayDate = moment().format('yyyy-MM-DD').toString();
    const endDate = schedule?.endDate || moment(todayDate).add(numberOfMonths, 'months').format('yyyy-MM-DD').toString();

    const startDate = schedule?.date || todayDate;
    const numberOfDaysBetweenStartAndEnd = moment(endDate, 'yyyy-MM-DD').diff(startDate, 'days') + (schedule?.endDate ? 0 : 5);

    const result = []
    const days = schedule?.weeklyRepeatDays?.map(i => i?.id);

    //Build an array of consecutive dates from the startDate, where the date's day is startDate's day. Eg Monday
    Array.from({ length: numberOfDaysBetweenStartAndEnd + 1 }).forEach((x, i) => {
        const date = moment(startDate, 'yyyy-MM-DD').add(i, 'days').format('yyyy-MM-DD').toString()
        const day = moment(date, 'yyyy-MM-DD').day();
        days.includes(day) && result.push(...schedule?.duration?.map(duration => {
            return {
                ...schedule, date, duration: {
                    ...duration, time: convertTimeToUtc({
                        date: schedule?.date || todayDate, time: duration?.time,
                        timeZone: schedule?.timeZone, type: 'time'
                    })
                }
            }
        }))
    })

    return result
}

const generateMonthlySchedules = ({ schedule, numberOfMonths }) => {
    const todayDate = moment().format('yyyy-MM-DD').toString();
    const endDate = schedule?.endDate || moment(todayDate).add(numberOfMonths, 'months').format('yyyy-MM-DD').toString();

    const startDate = schedule?.monthlyRepeatDays?.date || todayDate;
    const numberOfDaysBetweenStartAndEnd = Math.abs(moment(endDate, 'yyyy-MM-DD').diff(moment(startDate, 'yyyy-MM-DD'), 'days')) + (schedule?.endDate ? 0 : 5);

    //Get Start date's day
    const startDateDate = moment(startDate, 'yyyy-MM-DD').date();

    const monthDayMapping = {
        first: 0,
        second: 1,
        third: 2,
        fourth: 3,
    }

    const result = []

    const dateVersionHandler = (date) => {
        const dateTmp = moment(date, 'yyyy-MM-DD').date();
        startDateDate === dateTmp && result.push(...schedule?.duration?.map(duration => {
            return {
                ...schedule, date, duration: {
                    ...duration, time: convertTimeToUtc({
                        date: schedule?.date || todayDate, time: duration?.time,
                        timeZone: schedule?.timeZone, type: 'time'
                    })
                }
            }
        }))
    }

    const lastDayVersionHandler = (date) => {
        //Get all the specified day in the month
        const daysInMonth = moment(date, 'yyyy-MM-DD').daysInMonth()
        const firstDayOfMonth = moment(date, 'yyyy-MM-DD').startOf('month');
        const matchedDateList = Array.from({ length: daysInMonth }).map((i, ind) => ind).filter(i => {
            const day = firstDayOfMonth.add(i ? 1 : 0, 'days').day()
            const x = day === schedule?.monthlyRepeatDays?.day;

            return x
        }).map(i => moment(date, 'yyyy-MM-DD').startOf('month').add(i, 'days').format('yyyy-MM-DD').toString())
        //Pick the nth one, where n is the specified position
        result.push(...schedule?.duration?.map(duration => {
            return {
                ...schedule,
                date: matchedDateList.pop(),
                duration: {
                    ...duration, time: convertTimeToUtc({
                        date: schedule?.date || todayDate, time: duration?.time,
                        timeZone: schedule?.timeZone, type: 'time'
                    })
                }
            }
        }))
    }

    const inBetweenDayVersionHandler = (date) => {
        //Get all the specified day in the month
        const daysInMonth = moment(date, 'yyyy-MM-DD').daysInMonth()
        const firstDayOfMonth = moment(date, 'yyyy-MM-DD').startOf('month');
        const matchedDateList = Array.from({ length: daysInMonth }).map((i, ind) => ind).filter(i => {
            const day = firstDayOfMonth.add(i ? 1 : 0, 'days').day()
            const x = day === schedule?.monthlyRepeatDays?.day;

            return x
        }).map(i => moment(date, 'yyyy-MM-DD').startOf('month').add(i, 'days').format('yyyy-MM-DD').toString())
        //Pick the nth one, where n is the specified position
        result.push(...schedule?.duration?.map(duration => {
            return {
                ...schedule,
                date: matchedDateList[monthDayMapping[schedule?.monthlyRepeatDays?.position]],
                duration: {
                    ...duration, time: convertTimeToUtc({
                        date: schedule?.date || todayDate, time: duration?.time,
                        timeZone: schedule?.timeZone, type: 'time'
                    })
                }
            }
        }))
    }

    const handler = schedule.monthlyRepeatType === 'date' ?
        dateVersionHandler : schedule?.monthlyRepeatDays?.position !== 'last'
            ? inBetweenDayVersionHandler : lastDayVersionHandler;

    const usedMonths = []

    //Build an array of consecutive dates from the startDate, where the date's day is startDate's day. Eg Monday
    Array.from({ length: numberOfDaysBetweenStartAndEnd + 1 }).forEach((x, i) => {
        const date = moment(startDate, 'yyyy-MM-DD').add(i, 'days').format('yyyy-MM-DD').toString();
        if (schedule.monthlyRepeatType !== 'date' && usedMonths.includes(moment(date, 'yyyy-MM-DD').month())) return false;
        handler(date)
        usedMonths.push(moment(date, 'yyyy-MM-DD').month())
    })

    return result
}

const generateOnceSchedule = ({ schedule }) => {
    const date = moment().format('yyyy-MM-DD')
    return schedule?.duration?.map(duration => {
        duration = {
            ...duration,
            time: convertTimeToUtc({
                date: schedule?.date || date, time: duration?.time,
                timeZone: schedule?.timeZone, type: 'time'
            })
        }
        return { ...schedule, duration }
    })
}

export async function addSchedule(searchParams) {
    const title = searchParams.get('title');
    const details = searchParams.get('details');
    const location = searchParams.get('location');
    const serviceType = searchParams.get('serviceType');
    const speaker = searchParams.get('speaker');
    const isThereCharacterStudies = searchParams.get('isThereCharacterStudies');
    const bibleCharacters = JSON.parse(searchParams.get('bibleCharacters'));
    const isThereTopicalStudies = searchParams.get('isThereTopicalStudies');
    const topicalStudies = JSON.parse(searchParams.get('topicalStudies'));
    const frequency = searchParams.get('frequency');
    const date = searchParams.get('date');
    const liveLink = searchParams.get('liveLink');
    const duration = JSON.parse(searchParams.get('duration'));
    const timeZone = searchParams.get('timeZone');
    const endDate = searchParams.get('endDate');
    const weeklyRepeatDays = JSON.parse(searchParams.get('weeklyRepeatDays'));
    const monthlyRepeatType = searchParams.get('monthlyRepeatType');
    const monthlyRepeatDays = JSON.parse(searchParams.get('monthlyRepeatDays'));
    const conferences = searchParams.get('conferences');
    const id = searchParams.get('id');

    if (id) {
        await Schedule.updateOne({ _id: id }, {
            title, details, location, serviceType, speaker, isThereCharacterStudies, isThereTopicalStudies,
            bibleCharacters, topicalStudies, frequency, date, endDate, weeklyRepeatDays, monthlyRepeatDays,
            monthlyRepeatType, conferences, duration: {
                ...duration[0],
                time: convertTimeToUtc({ date, time: duration[0]?.time, timeZone, type: 'time' })
            }, liveLink,
        })
    }
    else {
        const schedule = {
            title, details, location, serviceType, speaker, isThereCharacterStudies, isThereTopicalStudies,
            bibleCharacters, topicalStudies, frequency, date, duration, endDate, weeklyRepeatDays,
            monthlyRepeatDays, monthlyRepeatType, conferences, liveLink, timeZone
        };

        const newScheduleArray = []
        //Get number of months from startdate
        const pastMonths = !date ? 0 : moment(moment().format('yyyy-MM-DD'), 'yyyy-MM-DD').diff(moment(date, 'yyyy-MM-DD'), 'months')

        const numberOfMonths = pastMonths >= 0 ? 0 : (Math.abs(pastMonths))

        if (frequency === 'once') newScheduleArray.push(...generateOnceSchedule({ schedule }) /* schedule */);
        if (frequency === 'daily') newScheduleArray.push(...generateDailySchedules({ schedule, numberOfMonths: numberOfMonths + 3 }))
        if (frequency === 'weekly') newScheduleArray.push(...generateWeeklySchedules({ schedule, numberOfMonths: numberOfMonths + 6 }))
        if (frequency === 'monthly') newScheduleArray.push(...generateMonthlySchedules({ schedule, numberOfMonths: numberOfMonths + 6 }))

        await Schedule.insertMany(newScheduleArray)
    }

    return { result: 'saved' }
}

const isOngoing = (currentHour, currentMinute, date, time, hours, minutes, status) => {
    if (status === 'cancelled') return false;

    const startTime = `${date} ${time}`;

    const sameDay = moment().format('yyyy-MM-DD').toString() === date;

    if (!sameDay) return false

    const timeArray = time?.split(':');
    const startHour = timeArray[0];
    const startMinute = timeArray[1];

    const endHour = Number(hours || 0) + Number(startHour || 0)
    const endMinute = Number(minutes || 0) + Number(startMinute || 0)

    const endTime = `${date} ${endHour}:${endMinute}`;
    const currentTime = `${date} ${currentHour}:${currentMinute}`;

    const isOngoing = sameDay && (new Date(endTime) > new Date(currentTime)) && (new Date(startTime) < new Date(currentTime))

    return isOngoing
}

const getTime = (date, time, minute, hour) => {
    const hourTime = Number(time?.split(':')[0]) + Number(hour ?? 0)
    const minuteTime = Number(time?.split(':')[1]) + Number(minute ?? 0)
    const value = `${date} ${hourTime < 10 ? `0${hourTime}` : hourTime}:${minuteTime < 10 ? `0${minuteTime}` : minuteTime}`
    return value
}

export async function getAllSchedule(searchParams) {
    let status = searchParams.get('status')
    const currentHour = new Date().getHours()
    const currentMinute = new Date().getMinutes()
    const todayDate = moment().format('yyyy-MM-DD').toString();

    const getDecision = (status) => {
        if (status === 'published') return ['unpublish', 'cancel']
        if (status === 'unpublished') return ['publish', 'cancel']
        if (status === 'cancelled') return ['publish', 'unpublish']
    }

    const getStatus = (schedule) => {
        const todayMonth = todayDate.split('-')[1]
        const scheduleDateMonth = schedule?.date.split('-')[1]

        const todayTimeStamp = `${todayDate} ${currentHour}:${currentMinute}`.replace(' ', '').replace('-', '').replace(':', '');
        const scheduleTimeStamp = getTime(schedule?.date, schedule?.duration?.time, schedule?.duration?.minutes ?? 0, schedule?.duration?.hours ?? 0,).replace(' ', '').replace('-', '').replace(':', '');

        if (isOngoing(currentHour, currentMinute, schedule?.date, schedule?.duration?.time, schedule?.duration.hours, schedule?.duration?.minutes, schedule?.status)) {
            return 'now'
        }
        if (schedule?.status === 'published' && todayMonth === scheduleDateMonth && (todayTimeStamp >= scheduleTimeStamp)) {
            return 'justConcluded'
        }
        if ((schedule?.status === 'published' && todayTimeStamp > scheduleTimeStamp)) {
            return 'concluded'
        }
        else return schedule?.status ?? 'published'
    }

    const schedules = await Schedule.find()

    //Get the speakers whose id is in the schedule
    const speakers = await GuestSpeaker.find({ _id: schedules?.map(i => i?.speaker) });

    const conferences = await Conference.find({ _id: schedules?.filter(i => i?.conferences)?.map(i => i?.conferences) });

    const parseDate = (date) => {
        const [day, month, year] = date?.split('/')
        return new Date(`${year}-${month}-${day}`)
    }

    //All schedules with resources
    const mappedSchedules = schedules?.filter(i => i?.resourceId)?.map(i => i?.resourceId);

    //Get the media for the mapped schedules
    const resources = await Resource.find({ _id: mappedSchedules });

    //Process data
    const data = schedules?.sort((a, b) => parseDate(a?.date) - parseDate(b?.date)).map(i => {
        const resourceData = i?.resourceId && resources?.find(it => it?._id?.toString() === i?.resourceId)
        const media = {
            audio: resourceData?.audio, video: resourceData?.video, audioDownload: resourceData?.audioDownload?.length && generateFileUrl(resourceData?.audioDownload),
            documentDownload: resourceData?.documentDownload?.length && generateFileUrl(resourceData?.documentDownload),
            resourceMapping: i?.resourceId
        };

        return {
            ...(i?.toObject()), date: moment(i?.date || new Date()).format('DD/MM/yyyy'),
            time: moment(i?.duration?.time, 'hh:mm').format('h:mma'), id: i?._id,
            duration: `${i?.duration?.hours ? (i?.duration?.hours + 'hours') : ''} ${i?.duration?.minutes ? (i?.duration?.minutes + ' minutes') : ''}`,
            title: i?.title, serviceType: i?.serviceType,
            conference: conferences?.find(it => it?._id?.toString() === i?.conferences)?.sectionTitle,
            speaker: speakers?.find(it => it?._id?.toString() === i?.speaker)?.name,
            decision: getDecision(i?.status), media, mappedDate: resourceData?.date,
            status: getStatus(i)
        }
    });

    return { result: { rows: !status ? data : data?.filter(i => i?.status === status) } }
}

export async function getOneSchedule(searchParams) {
    const id = searchParams.get('id');

    const schedule = await Schedule.findOne({ _id: id })

    const currentHour = new Date().getHours()
    const currentMinute = new Date().getMinutes()
    const todayDate = moment().format('yyyy-MM-DD').toString();

    //Get the speakers whose id is in the schedule
    const speaker = await GuestSpeaker.findOne({ _id: schedule?.speaker });

    //Get the bible characters 
    const characters = schedule?.bibleCharacters?.length ? await BibleCharacter.find({ _id: schedule?.bibleCharacters?.map(i => i?.id) }) : []

    //Get the topical studies
    const topics = schedule?.topicalStudies?.length ? await TopicalStudy.find({ _id: schedule?.topicalStudies?.map(i => i?.id) }) : []

    const location = await Location.find();

    const liveLinks = await LiveLink.find();

    const getStatus = (schedule) => {
        const todayMonth = todayDate.split('-')[1]
        const scheduleDateMonth = schedule?.date.split('-')[1]

        const todayTimeStamp = `${todayDate} ${currentHour}:${currentMinute}`.replace(' ', '').replace('-', '').replace(':', '');
        const scheduleTimeStamp = getTime(schedule?.date, schedule?.duration?.time, schedule?.duration?.minutes ?? 0, schedule?.duration?.hours ?? 0,).replace(' ', '').replace('-', '').replace(':', '');

        if (isOngoing(currentHour, currentMinute, schedule?.date, schedule?.duration?.time, schedule?.duration.hours, schedule?.duration?.minutes, schedule?.status)) {
            return 'now'
        }
        if (schedule?.status === 'published' && todayMonth === scheduleDateMonth && (todayTimeStamp >= scheduleTimeStamp)) {
            return 'justConcluded'
        }
        if ((schedule?.status === 'published' && todayTimeStamp > scheduleTimeStamp)) {
            return 'concluded'
        }
        else return schedule?.status ?? 'published'
    }

    //Process data
    const data = {
        ...schedule?.toObject(), date: moment(schedule?.date || new Date()).format('DD/MM/yyyy'),
        time: moment(schedule?.duration?.time, 'hh:mm').format('h:mma'),
        id: schedule?._id, location: location?.find(i => i?._id.toString() === schedule?.location)?.address,
        liveLink: liveLinks?.find(i => i?._id.toString() === schedule?.liveLink)?.link,
        duration: `${schedule?.duration?.hours ? (schedule?.duration?.hours + 'hours') : ''} ${schedule?.duration?.minutes ? (schedule?.duration?.minutes + ' minutes') : ''}`,
        title: schedule?.title, serviceType: schedule?.serviceType, bibleCharacters: characters?.map(i => i?.name),
        speaker: { name: speaker?.name, image: generateFileUrl(speaker?.image) }, topicalStudies: topics?.map(i => i?.sectionTitle),
        decision: ['unpublish',], status: getStatus(schedule)// schedule?.status ?? 'published'
    }

    return { result: data }
}

export async function deleteSchedule(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Schedule.deleteMany({ _id: id });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function publishSchedule(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Schedule.updateMany({ _id: id }, { status: 'published' });

        return { result: 'published' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function unpublishSchedule(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Schedule.updateMany({ _id: id }, { status: 'unpublished' });

        return { result: 'unpublished' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function cancelSchedule(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Schedule.updateMany({ _id: id }, { status: 'cancelled' });

        return { result: 'cancelled' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function addResource(searchParams) {
    const title = searchParams.get('title');
    const date = searchParams.get('date');
    const scripture = searchParams.get('scripture');
    const bookOfScripture = searchParams.get('bookOfScripture');
    const chapter = searchParams.get('chapter');
    const verse = JSON.parse(searchParams.get('verse'));
    const serviceType = searchParams.get('serviceType');
    const speaker = searchParams.get('speaker');
    const isThereCharacterStudies = searchParams.get('isThereCharacterStudies');
    const bibleCharacters = JSON.parse(searchParams.get('bibleCharacters'));
    const isThereTopicalStudies = searchParams.get('isThereTopicalStudies');
    const topicalStudies = JSON.parse(searchParams.get('topicalStudies'));
    const video = searchParams.get('video');
    const audio = searchParams.get('audio');
    const audioDownload = searchParams.get('audioDownload');
    const documentDownload = searchParams.get('documentDownload');
    const id = searchParams.get('id');
    const draft = searchParams.get('draft');
    const status = searchParams.get('status');
    const conferences = searchParams.get('conferences');

    //Save the audioDownload
    const updateAudio = (audioDownload instanceof Blob);
    const audioSaved = updateAudio && await upload({ file: audioDownload, filename: audioDownload?.name, category: 'audio' });
    const audioName = audioSaved?.data?.filename

    //Save the document
    const updateDocument = (documentDownload instanceof Blob);
    const documentSaved = updateDocument && await upload({ file: documentDownload, filename: documentDownload?.name, category: 'document' });
    const documentName = documentSaved?.data?.filename

    if (draft) {
        id ? await Resource.updateOne({ _id: id }, {
            title, date, scripture, bookOfScripture, chapter, verse, serviceType, speaker, isThereCharacterStudies,
            isThereTopicalStudies, bibleCharacters, topicalStudies, audio, video, conferences,
            ...(updateAudio ? { audioDownload: `audio/${audioName}` } : {}),
            ...(updateDocument ? { documentDownload: `document/${documentName}` } : {}),
        }) : await Resource.create({
            title, date, scripture, bookOfScripture, chapter, verse, serviceType, speaker, isThereCharacterStudies,
            isThereTopicalStudies, bibleCharacters, topicalStudies, audio, video, status: 'saved', conferences,
            ...(updateAudio ? { audioDownload: `audio/${audioName}` } : {}),
            ...(updateDocument ? { documentDownload: `document/${documentName}` } : {}),
        })
    }
    else if (id) {
        await Resource.updateOne({ _id: id }, {
            title, date, scripture, bookOfScripture, chapter, verse, serviceType, speaker, isThereCharacterStudies,
            isThereTopicalStudies, bibleCharacters, topicalStudies, audio, video, status, conferences,
            ...(updateAudio ? { audioDownload: `audio/${audioName}` } : {}),
            ...(updateDocument ? { documentDownload: `document/${documentName}` } : {}),
        })
    }
    else {
        await Resource.create({
            title, date, scripture, bookOfScripture, chapter, verse, serviceType, speaker, isThereCharacterStudies,
            isThereTopicalStudies, bibleCharacters, topicalStudies, audio, video, status: 'published', conferences,
            ...(updateAudio ? { audioDownload: `audio/${audioName}` } : {}),
            ...(updateDocument ? { documentDownload: `document/${documentName}` } : {}),
        })
    }

    return { result: 'saved' }
}

export async function getAllResources(searchParams) {
    const status = searchParams.get('status');

    const getDecision = (status) => {
        if (status === 'published') return ['unpublish',]
        if (status === 'unpublished' || status === 'saved') return ['publish',]
    }

    const resources = await Resource.find({ ...(status ? { status } : {}) })

    //Get the speakers whose id is in the resource
    const speakers = await GuestSpeaker.find({ _id: resources?.map(i => i?.speaker) });

    const topics = resources?.map(i => i?.topicalStudies?.map(it => it?.id)?.flat(1)).flat(1)

    //Get the bible Characters whose id is in the schedule
    const bibleCharacters = await BibleCharacter.find({ _id: resources?.map(i => i?.bibleCharacters?.map(it => it?.id)?.flat(1)).flat(1) });

    //Get the topical Characters whose id is in the schedule
    const topicalCharacter = await TopicalStudy.find({ _id: (resources?.map(i => i?.topicalStudies?.map(it => it?.id)?.flat(1)).flat(1)) });

    const conferences = await Conference.find({ _id: resources?.filter(i => i?.conferences)?.map(i => i?.conferences) });

    const parseDate = (date) => {
        const [day, month, year] = date?.split('/')
        return new Date(`${year}-${month}-${day}`)
    }

    //Process data
    const data = resources?.sort((a, b) => parseDate(a?.date) - parseDate(b?.date)).map(i => {
        const media = {
            audio: i?.audio, video: i?.video, audioDownload: i?.audioDownload?.length && generateFileUrl(i?.audioDownload),
            documentDownload: i?.documentDownload?.length && generateFileUrl(i?.documentDownload)
        };

        const topics = i?.topicalStudies?.map(it => it?.id)?.flat(1)
        const characters = i?.bibleCharacters?.map(it => it?.id)?.flat(1)

        return {
            ...(i?.toObject()), date: moment(i?.date || new Date()).format('DD/MM/yyyy'),
            id: i?._id, bibleCharacter: bibleCharacters?.filter(it => characters?.includes(it?._id?.toString()))?.map(i => i?.name), testament: i?.scripture,
            topicalStudies: topicalCharacter?.filter(it => topics?.includes(it?._id?.toString()))?.map(i => i?.sectionTitle),
            scripture: `${i?.bookOfScripture} ${i?.chapter}:${i?.verse?.start}${i?.verse?.end ? ('-' + i?.verse?.end) : ''}`,
            media, speaker: speakers?.find(it => it?._id?.toString() === i?.speaker)?.name,
            decision: getDecision(i?.status), status: i?.status ?? 'published', actions: media,
            conference: conferences?.find(it => it?._id?.toString() === i?.conferences)?.sectionTitle,
            types: ['verse-by-verse', i?.serviceType, 'guest-speakers',
                ...(i?.isThereCharacterStudies ? ['character-studies'] : []),
                ...(i?.isThereTopicalStudies ? ['topical-studies'] : []),]
        }
    });

    /*  const counts={
         newTestament:{}
     } */

    return { result: { rows: data, } }

}

export async function getDataForNewResource(searchParams) {
    const id = searchParams.get('id');

    //get all guest speakers
    const speakers = await GuestSpeaker.find()

    //Get all topics
    const topics = await TopicalStudy.find()

    //Get all bible characters
    const bibleCharacters = await BibleCharacter.find();

    //Get all conferences
    const conferences = await Conference.find();

    let existingData = null;

    if (id) {
        existingData = await Resource.findOne({ _id: id })
    }

    return { result: { speakers, topics, bibleCharacters, conferences, existingData } }
}

export async function getOneResource(searchParams) {
    const id = searchParams.get('id');

    const resource = await Resource.findOne({ _id: id })

    //Get the speakers whose id is in the schedule
    const speaker = await GuestSpeaker.findOne({ _id: resource?.speaker });

    //Get the bible characters 
    const characters = resource?.bibleCharacters?.length ? await BibleCharacter.find({ _id: resource?.bibleCharacters?.map(i => i?.id) }) : []

    //Get the topical studies
    const topics = resource?.topicalStudies?.length ? await TopicalStudy.find({ _id: resource?.topicalStudies?.map(i => i?.id) }) : []

    //Process data
    const data = {
        ...resource?.toObject(), date: moment(resource?.date || new Date()).format('DD/MM/yyyy'),
        id: resource?._id, title: resource?.title, serviceType: resource?.serviceType,
        bibleCharacters: characters?.map(i => i?.name), speaker: {
            name: speaker?.name,
            image: generateFileUrl(speaker?.image)
        }, topicalStudies: topics?.map(i => i?.sectionTitle), status: resource?.status ?? 'published',
        audioDownload: resource?.audioDownload && generateFileUrl(resource?.audioDownload),
        documentDownload: resource?.documentDownload && generateFileUrl(resource?.documentDownload),
        scripture: `${resource?.bookOfScripture} ${resource?.chapter}:${resource?.verse?.start}${resource?.verse?.end ? ('-' + resource?.verse?.end) : ''}`,
    }

    return { result: data }

}

export async function deleteResource(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Resource.deleteMany({ _id: id });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function publishResource(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Resource.updateMany({ _id: id }, { status: 'published' });

        return { result: 'published' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function unpublishResource(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Resource.updateMany({ _id: id }, { status: 'unpublished' });

        return { result: 'unpublished' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function addPrayerRequestTopic(searchParams) {
    const title = searchParams.get('title');
    const id = searchParams.get('id');

    if (id) {
        await PrayerRequestTopic.updateOne({ _id: id }, {
            title,
        })
    }
    else {
        await PrayerRequestTopic.create({
            title,
        })
    }

    return { result: 'saved' }
}

export async function getAllPrayerRequestTopics(searchParams) {

    const data = (await PrayerRequestTopic.find()).map(i => { return { title: i?.title, id: i?._id } });

    return { result: { rows: data } };
}

export async function getOnePrayerRequestTopic(searchParams) {
    const id = searchParams.get('id');

    const data = await PrayerRequestTopic.findOne({ _id: id });

    return { result: { id: data?._id, title: data?.title } };
}

export async function deletePrayerRequestTopic(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await PrayerRequestTopic.deleteMany({ _id: id });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function updateContactForm(searchParams) {
    const banner = searchParams.get('banner');
    const heroText = searchParams.get('heroText');
    const heroSubtitle = searchParams.get('heroSubtitle');
    const details = searchParams.get('details');
    const address = searchParams.get('address');
    // const addressLink = searchParams.get('addressLink');
    const topics = JSON.parse(searchParams.get('topics'));
    const pageName = searchParams.get('pageName');

    if (banner && heroText && address && /* addressLink &&  */details && topics?.length) {
        //Save the banner
        const updateBanner = (banner instanceof Blob);

        const bannerSaved = updateBanner && await upload({ file: banner, filename: banner?.name, category: 'banner' })

        const bannerName = bannerSaved?.data?.filename

        //Save the data
        await ContactForm.updateOne({ pageName }, {
            $set: {
                ...(updateBanner ? { banner: `banner/${bannerName}` } : {}),
                heroText, address, heroSubtitle, topics, details
            },
        }, { upsert: true })

        return { result: 'saved' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getDataForContactForm(searchParams) {
    const data = await ContactForm.findOne();

    const topics = (await PrayerRequestTopic.find()).map(i => { return { title: i?.title, id: i?._id } });

    const locations = (await Location.find()).map(i => { return { ...i?.toObject(), id: i?._id } });

    return {
        result: {
            ...data?.toObject(),
            id: data?._id,
            prayerRequestTopics: topics,
            locations
        }
    };
}

export async function getOneContactForm(searchParams) {
    const data = await ContactForm.findOne();

    const topics = await PrayerRequestTopic.find()

    const location = await Location.findOne({ _id: data?.address });

    return {
        result: {
            ...data?.toObject(),
            coordinate: location?.coordinate, address: location?.address,
            topics: data?.topics?.length && data?.topics?.map(i => topics?.find(it => it?._id?.toString() === i?.id)),
            id: data?._id
        }
    };
}

export async function getAllMessages(searchParams) {
    let status = searchParams.get('status');
    status = status === 'unreplied' ? ['read', 'unread'] : status === 'replied' ? ['replied'] : null;

    let data = await Message.find({ ...(status ? { status } : {}), })

    const topics = await PrayerRequestTopic.find({ _id: data?.filter(i => i?.topic)?.map(i => i?.topic) })
    data = data.map(i => {
        return {
            ...i?.toObject(), name: `${i?.firstName} ${i?.lastName}`,
            id: i?._id, date: moment(i?.createdAt).format('DD/MM/yyyy')?.toString(),
            time: moment(i?.createdAt).format('h:mma')?.toString(), hasTopic: Boolean(i?.topic),
            topic: i?.topic && topics?.find(it => it?._id?.toString() === i?.topic)?.title
        }
    })?.sort((a, b) => b?.id - a?.id);

    return { result: { rows: data } }
}

export async function deleteMessage(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Message.deleteMany({ _id: id });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getOneMessage(searchParams) {
    const id = searchParams.get('id');

    let data = await Message.findOne({ _id: id })

    const topic = data?.topic && await PrayerRequestTopic.findOne({ _id: data?.topic });

    //  const emailList = (await ContactEmail.find()).map(i => i?.title);

    const repliedBy = (data?.repliedBy && (await User.findOne({ _id: data?.repliedBy }))?.fullName) ?? 'A Deleted Admin'

    await Message.updateOne({ _id: id, status: { $not: { $regex: '^replied', $options: 'i' } } },
        { $set: { status: 'read' } })

    data = {
        ...data?.toObject(), name: `${data?.firstName} ${data?.lastName}`,
        id: data?._id, date: moment(data?.createdAt).format('DD/MM/yyyy')?.toString(),
        time: moment(data?.createdAt).format('h:mma')?.toString(), hasTopic: Boolean(data?.topic),
        topic: data?.topic ? topic?.title : 'None', repliedBy, reply: data?.reply ?? null,
        // emailList
    }

    return { result: data }
}

export async function sendReply(searchParams) {
    const reply = searchParams.get('reply');
    const id = searchParams.get('id');

    const userData = await Message.findOne({ _id: id });

    const email = await ContactEmail.findOne({ active: true });

    await sendEmail({
        toEmail: userData.email, fromEmail: email.title || process.env.EMAIL,
        fromHeading: `Enquiry Reply <${email.title || process.env.EMAIL}>`,
        password: email.password || process.env.EMAIL_PASSWORD,
        subject: 'RE: Calvary Chapel', text: reply, html: reply,
    })

    const repliedBy = (await getUser())?.id;

    if (id && reply) {
        await Message.updateOne({ _id: id }, { $set: { reply, repliedBy } })
        await Message.updateOne({ _id: id }, { $set: { status: 'replied' } })
        return { result: 'sent' }
    }
    else {
        return { result: 'A required field is missing' }
    }
}

export async function markAsRead(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Message.updateMany({ _id: id }, { $set: { status: 'read' } })
        return { result: 'done' }
    }
    else {
        return { result: 'Id is required' }
    }
}

export async function markAsUnread(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Message.updateMany({ _id: id }, { $set: { status: 'unread' } })
        return { result: 'done' }
    }
    else {
        return { result: 'Id is required' }
    }
}

export async function updateMeta(searchParams) {
    const tag = searchParams.get('tag');
    const parent = searchParams.get('parent');
    const title = searchParams.get('title');
    const description = searchParams.get('description');


    if (tag && parent && title && description) {
        await Meta.updateOne({ tag, parent }, { $set: { title, description } }, { upsert: true })
        return { result: 'updated' }
    }
    else {
        return { result: 'A required field is missing' }
    }
}

export async function getAllMetaInformation(searchParams) {

    let data = await Meta.find()

    return { result: data }
}

export async function getOneMetaInformation(searchParams) {
    const tag = searchParams.get('tag')
    const parent = searchParams.get('parent')

    let data = await Meta.findOne({ tag, parent })

    return { result: data }
}

export async function updateHeader(searchParams) {
    const logo = searchParams.get('logo');
    const title = searchParams.get('title');
    const pageName = 'header'

    if (logo) {
        const updateLogo = (logo instanceof Blob);

        const logoSaved = updateLogo && await upload({ file: logo, filename: logo?.name, category: 'headerLogo' })

        const logoName = logoSaved?.data?.filename

        await Header.updateOne({ pageName }, {
            $set: {
                ...(updateLogo ? { logo: `headerLogo/${logoName}` } : {}),
                title
            },
        }, { upsert: true })

        return { result: 'saved' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getHeader(searchParams) {
    const header = await Header.findOne();

    const footer = await Footer.findOne();

    const locations = (await Location.find()).map(i => { return { ...i?.toObject(), id: i?._id } });

    const address = locations?.find(i => i?.id?.toString() === footer?.address);

    const getAddressLink = () => {
        const url = `https://www.google.com/maps?q=${address?.coordinate?.lat},${address?.coordinate?.lng}`

        return url
    }

    return {
        result: {
            header: header ? { ...header?.toObject(), logo: generateFileUrl(header?.logo) } : null,
            footer: footer ? { ...footer?.toObject(), logo: generateFileUrl(footer?.logo) } : null,
            locations, url: getAddressLink(),
            address: address?.address
        }
    }
}

export async function updateFooter(searchParams) {
    const logo = searchParams.get('logo');
    const title = searchParams.get('title');
    const facebookLink = searchParams.get('facebookLink');
    const youtubeLink = searchParams.get('youtubeLink');
    const address = searchParams.get('address');
    //  const addressLink = searchParams.get('addressLink');
    const phone = searchParams.get('phone');
    const pageName = 'footer'

    if (logo && address && facebookLink && youtubeLink) {
        const updateLogo = (logo instanceof Blob);

        const logoSaved = updateLogo && await upload({ file: logo, filename: logo?.name, category: 'headerLogo' })

        const logoName = logoSaved?.data?.filename

        await Footer.updateOne({ pageName }, {
            $set: {
                ...(updateLogo ? { logo: `headerLogo/${logoName}` } : {}),
                title, address, facebookLink, youtubeLink, phone
            },
        }, { upsert: true })

        return { result: 'saved' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function searchCMS(searchParams) {
    const data = searchParams.get('data');

    const ministryMapping = {
        'men-service': { id: 'men-ministry', label: "Men's Ministry" },
        'women-service': { id: 'women-ministry', label: "Women's Ministry" },
        'youth-service': { id: 'youth-ministry', label: "Youth's Ministry" },
        'children-service': { id: 'children-ministry', label: "Children's Ministry" },
    }

    const otherLabelMapping = {
        heroText: 'Hero Text',
        heroSubtitle: 'Hero Subtitle',
        bodyDetails: 'Details',
        bodyTitle: 'Title',
        title: 'Title',
        scripture: 'Testament',
        bookOfScripture: 'Scripture Book',
        name: 'Name',
        sectionTitle: 'Title',
        section1Heading: 'Section Heading',
        section2Heading: 'Section Heading',
        section3Heading: 'Section Heading',
        section1Text: 'Section Text',
        section2Text: 'Section Text',
        section3Text: 'Section Text',
        email: 'Email Address',
        about: 'About Text',
        details: 'Details',
        location: 'Location',
        address: 'Address',
        addressLink: 'Map Address Link',
        firstName: 'First name',
        lastName: 'Last name',
        message: 'Message',
        reply: 'Reply',
        facebookLink: 'Facebook Link',
        youtubeLink: 'Youtube Link',
        fullName: 'Full Name',
        description: 'Description'
    }

    const ministry = await Ministry.find({
        // bodyTitle: { $regex: `^${data}`, $options: 'i' },
        $or: [
            { bodyTitle: { $regex: `^${data}`, $options: 'i' } },
            { bodyDetails: { $regex: `^${data}`, $options: 'i' } },
            { heroSubtitle: { $regex: `^${data}`, $options: 'i' } },
            { heroText: { $regex: `^${data}`, $options: 'i' } }
        ]
    })

    const homepage = await Homepage.find({
        $or: [
            { heroSubtitle: { $regex: `^${data}`, $options: 'i' } },
            { heroText: { $regex: `^${data}`, $options: 'i' } }
        ]
    })

    const allResources = await Resource.find({
        $or: [
            { title: { $regex: `^${data}`, $options: 'i' } },
            { scripture: { $regex: `^${data}`, $options: 'i' } },
            { bookOfScripture: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const guestSpeakers = await GuestSpeaker.find({
        $or: [
            { name: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const bibleCharacters = await BibleCharacter.find({
        $or: [
            { name: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const topicalCharacters = await TopicalStudy.find({
        $or: [
            { sectionTitle: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const conferences = await Conference.find({
        $or: [
            { sectionTitle: { $regex: `^${data}`, $options: 'i' } },
            { name: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const resourceMinistry = await ResourceMinistry.find({
        $or: [
            { sectionTitle: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const history = await History.find({
        $or: [
            { heroSubtitle: { $regex: `^${data}`, $options: 'i' } },
            { heroText: { $regex: `^${data}`, $options: 'i' } },
            { section1Heading: { $regex: `^${data}`, $options: 'i' } },
            { section2Heading: { $regex: `^${data}`, $options: 'i' } },
            { section3Heading: { $regex: `^${data}`, $options: 'i' } },
            { section1Text: { $regex: `^${data}`, $options: 'i' } },
            { section2Text: { $regex: `^${data}`, $options: 'i' } },
            { section3Text: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const faith = await Faith.find({
        $or: [
            { bodyTitle: { $regex: `^${data}`, $options: 'i' } },
            { heroSubtitle: { $regex: `^${data}`, $options: 'i' } },
            { heroText: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const leadership = await Leadership.find({
        $or: [
            { heroSubtitle: { $regex: `^${data}`, $options: 'i' } },
            { heroText: { $regex: `^${data}`, $options: 'i' } },
            { 'leaders.name': { $regex: `^${data}`, $options: 'i' } },
            { 'leaders.email': { $regex: `^${data}`, $options: 'i' } },
            { 'leaders.about': { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const schedule = await Schedule.find({
        $or: [
            { title: { $regex: `^${data}`, $options: 'i' } },
            { details: { $regex: `^${data}`, $options: 'i' } },
            { location: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const contactForm = await ContactForm.find({
        $or: [
            { address: { $regex: `^${data}`, $options: 'i' } },
            { details: { $regex: `^${data}`, $options: 'i' } },
            { addressLink: { $regex: `^${data}`, $options: 'i' } },
            { heroText: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const enquiries = await Message.find({
        $or: [
            { firstName: { $regex: `^${data}`, $options: 'i' } },
            { lastName: { $regex: `^${data}`, $options: 'i' } },
            { email: { $regex: `^${data}`, $options: 'i' } },
            { message: { $regex: `^${data}`, $options: 'i' } },
            { reply: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const prayerTopics = await PrayerRequestTopic.find({
        $or: [
            { title: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const header = await Header.find({
        $or: [
            { title: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const footer = await Footer.find({
        $or: [
            { address: { $regex: `^${data}`, $options: 'i' } },
            { addressLink: { $regex: `^${data}`, $options: 'i' } },
            { facebookLink: { $regex: `^${data}`, $options: 'i' } },
            { youtubeLink: { $regex: `^${data}`, $options: 'i' } },
            { phone: { $regex: `^${data}`, $options: 'i' } },
            { title: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const admin = await User.find({
        $or: [
            { email: { $regex: `^${data}`, $options: 'i' } },
            { fullName: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const meta = await Meta.find({
        $or: [
            { description: { $regex: `^${data}`, $options: 'i' } },
            { title: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const location = await Location.find({
        $or: [
            { title: { $regex: `^${data}`, $options: 'i' } },
            { address: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const contactEmail = await ContactEmail.find({
        $or: [
            { title: { $regex: `^${data}`, $options: 'i' } },
        ]
    })

    const finalResult = [
    ]

    homepage.forEach((item) => {
        const list = ['heroSubtitle', 'heroText'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'page', }
                payload.label = `${otherLabelMapping[it]} in Homepage`;
                payload.data = {
                    url: `/admin/homepage`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    ministry.forEach((item) => {
        const list = ['bodyTitle', 'bodyDetails', 'heroSubtitle', 'heroText'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'page', }
                payload.label = `${otherLabelMapping[it]} in ${ministryMapping[item?.ministry]?.label}`;
                payload.data = {
                    url: `/admin/ministry/${ministryMapping[item?.ministry]?.id}`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    allResources.forEach((item) => {
        const list = ['title', 'scripture', 'bookOfScripture'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'resources', }
                payload.label = `${otherLabelMapping[it]} in ${'All Resources'} `;
                payload.data = {
                    url: `/admin/resources/all-resources/view?id=${item?._id}`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    guestSpeakers.forEach((item) => {
        const list = ['name'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'settings', }
                payload.label = `${otherLabelMapping[it]} in ${'Guest Speaker'} `;
                payload.data = {
                    url: `/admin/resources/guest-speakers`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    bibleCharacters.forEach((item) => {
        const list = ['name'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'settings', }
                payload.label = `${otherLabelMapping[it]} in ${'Bible Character'} `;
                payload.data = {
                    url: `/admin/resources/bible-characters`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    topicalCharacters.forEach((item) => {
        const list = ['sectionTitle'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'settings', }
                payload.label = `${otherLabelMapping[it]} in ${'Topical Character'} `;
                payload.data = {
                    url: `/admin/resources/topical-characters`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    conferences.forEach((item) => {
        const list = ['sectionTitle', 'name'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'settings', }
                payload.label = `${otherLabelMapping[it]} in ${'Conference'} `;
                payload.data = {
                    url: `/admin/resources/conferences`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    /*    resourceMinistry.forEach((item) => {
           const list = ['sectionTitle'];
           list.forEach(it => {
               if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                   const payload = { section: 'resources', }
                   payload.label = `${otherLabelMapping[it]} in ${"Resource's Ministry"} `;
                   payload.data = {
                       url: `/admin/resources/ministry`,
                       value: item[it]
                   }
                   finalResult.push(payload)
               }
           });
       }) */

    history.forEach((item) => {
        const list = ['heroSubtitle', 'heroText', 'section1Heading', 'section2Heading',
            'section3Heading', 'section1Text', 'section2Text', 'section3Text'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'page', }
                payload.label = `${otherLabelMapping[it]} in ${"History of CCT"} `;
                payload.data = {
                    url: `/admin/about/history`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    faith.forEach((item) => {
        const list = ['heroSubtitle', 'heroText', 'bodyTitle'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'page', }
                payload.label = `${otherLabelMapping[it]} in ${"Statement Of Faith"} `;
                payload.data = {
                    url: `/admin/about/faith`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    leadership.forEach((item) => {
        const list = ['heroSubtitle', 'heroText', 'leaders'];
        list.forEach(it => {
            const subList = ['name', 'email', 'about'];
            if (it === 'leaders') {
                const matchedLeaders = item.leaders?.filter(i => subList?.find(it => i[it]?.toLowerCase()?.startsWith(data?.toLowerCase())))

                matchedLeaders.forEach(leader => {
                    subList.forEach(ite => {
                        if (leader[ite]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                            const payload = { section: 'page', }
                            payload.label = `${otherLabelMapping[ite]} of Leader in ${"Leadership"} `;
                            payload.data = {
                                url: `/admin/about/leadership`,
                                value: leader[ite]
                            }
                            ite === 'email' && (payload.noCapitalize = true)
                            finalResult.push(payload)
                        }
                    })
                })
            }
            else if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'about', }
                payload.label = `${otherLabelMapping[it]} in ${"Leadership"} `;
                payload.data = {
                    url: `/admin/about/leadership`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    schedule.forEach((item) => {
        const list = ['title', 'details', 'location'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'schedule', }
                payload.label = `${otherLabelMapping[it]} in ${"a Schedule"} `;
                payload.data = {
                    url: `/admin/schedule/view?id=${item?._id}`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    contactForm.forEach((item) => {
        const list = ['address', 'addressLink', 'details', 'heroText'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'page', }
                payload.label = `${otherLabelMapping[it]} in ${"Contact Forms"} `;
                payload.data = {
                    url: `/admin/contact/contact-form`,
                    value: item[it]
                }
                it === 'addressLink' && (payload.noCapitalize = true)
                finalResult.push(payload)
            }
        });
    })

    enquiries.forEach((item) => {
        const list = ['firstName', 'lastName', 'email', 'message', 'reply'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'contact', }
                payload.label = `${otherLabelMapping[it]} in ${"an Enquiry"} `;
                payload.data = {
                    url: `/admin/contact/view?id=${item?._id}`,
                    value: item[it]
                }
                it === 'email' && (payload.noCapitalize = true)
                finalResult.push(payload)
            }
        });
    })

    prayerTopics.forEach((item) => {
        const list = ['title'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'settings', }
                payload.label = `Title in ${"Prayer request Topic"} `;
                payload.data = {
                    url: `/admin/contact/prayer-request-topics/view?id=${item?._id}`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    header.forEach((item) => {
        const list = ['title'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'settings', }
                payload.label = `Title in ${"Header"} `;
                payload.data = {
                    url: `/admin/header`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    footer.forEach((item) => {
        const list = ['address', 'addressLink', 'facebookLink', 'youtubeLink', 'phone', 'title'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'settings', }
                payload.label = `${otherLabelMapping[it]} in ${"Footer"} `;
                payload.data = {
                    url: `/admin/footer`,
                    value: item[it]
                }
                const noCapitalize = ['addressLink', 'facebookLink', 'youtubeLink']
                noCapitalize.includes(it) && (payload.noCapitalize = true)
                finalResult.push(payload)
            }
        });
    })

    admin.forEach((item) => {
        const list = ['email', 'fullName'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'admin', }
                payload.label = `${otherLabelMapping[it]} in ${"Admin Section"} `;
                payload.data = {
                    url: `/admin/admin/view?id=${item?._id}`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    meta.forEach((item) => {
        const list = ['description', 'title'];
        list.forEach(it => {
            if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                const payload = { section: 'settings', }
                payload.label = `${otherLabelMapping[it]} in ${"Meta Information Section"} `;
                payload.data = {
                    url: `/admin/meta`,
                    value: item[it]
                }
                finalResult.push(payload)
            }
        });
    })

    /*   contactEmail.forEach((item) => {
          const list = ['title'];
          list.forEach(it => {
              if (item[it]?.toLowerCase()?.startsWith(data?.toLowerCase())) {
                  const payload = { section: 'settings', }
                  payload.label = `${otherLabelMapping[it]} in ${"Meta Information Section"} `;
                  payload.data = {
                      url: `/admin/meta`,
                      value: item[it]
                  }
                  finalResult.push(payload)
              }
          });
      })
   */
    return { result: finalResult }
}

export async function minutesAgoGA(searchParams) {
    const minutesAgo = searchParams.get('minutesAgo');

    const analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('ascii'))
    })


    //Get real time data
    const [response] = await analyticsDataClient.runRealtimeReport(
        {
            property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
            minuteRanges: [
                {
                    name: `0-${minutesAgo} minutes ago`,
                    startMinutesAgo: minutesAgo,
                },
            ],
            dimensions: [
                { name: 'deviceCategory' },
                { name: 'eventName' }
            ],
            /*  metrics: [
                 { name: 'activeUsers' },
             ], */
        })


    const result = [
        { name: 'Desktop', color: '#008000', value: response.rows?.filter(i => i?.dimensionValues[1]?.value === 'page_view' && i?.dimensionValues[0]?.value === 'desktop')?.length },
        { name: 'Tablet', color: '#FFA500', value: response.rows?.filter(i => i?.dimensionValues[1]?.value === 'page_view' && i?.dimensionValues[0]?.value === 'tablet')?.length },
        { name: 'Mobile', color: '#D20ED2', value: response.rows?.filter(i => i?.dimensionValues[1]?.value === 'page_view' && i?.dimensionValues[0]?.value === 'mobile')?.length },
    ]

    return { response, result }
}

export async function sections(searchParams) {
    // Resources
    const resources = await Resource.find();

    // Contact
    const contact = await Message.find();

    //Schedule
    const schedule = await Schedule.find();

    //Admin
    const admin = await User.find();

    const currentHour = new Date().getHours()
    const currentMinute = new Date().getMinutes()
    const todayDate = moment().format('yyyy-MM-DD').toString();

    const getStatus = (schedule) => {
        const todayMonth = todayDate.split('-')[1]
        const scheduleDateMonth = schedule?.date.split('-')[1]

        const todayTimeStamp = `${todayDate} ${currentHour}:${currentMinute}`.replace(' ', '').replace('-', '').replace(':', '');
        const scheduleTimeStamp = getTime(schedule?.date, schedule?.duration?.time, schedule?.duration?.minutes ?? 0, schedule?.duration?.hours ?? 0,).replace(' ', '').replace('-', '').replace(':', '');

        if (isOngoing(currentHour, currentMinute, schedule?.date, schedule?.duration?.time, schedule?.duration.hours, schedule?.duration?.minutes, schedule?.status)) {
            return 'now'
        }
        if (schedule?.status === 'published' && todayMonth === scheduleDateMonth && (todayTimeStamp >= scheduleTimeStamp)) {
            return 'justConcluded'
        }
        if ((schedule?.status === 'published' && todayTimeStamp > scheduleTimeStamp)) {
            return 'concluded'
        }
        else return schedule?.status ?? 'published'
    }

    const result = {
        resources: {
            totalCreated: resources?.length,
            totalPublished: resources?.filter(i => i?.status === 'published')?.length,
            totalUnpublished: resources?.filter(i => i?.status === 'unpublished')?.length,
            totalSaved: resources?.filter(i => i?.status === 'saved')?.length,
        },
        contact: {
            totalCreated: contact?.length,
            totalReplied: contact?.filter(i => i?.status === 'replied')?.length,
            totalUnreplied: contact?.filter(i => i?.status !== 'replied')?.length,
        },
        schedule: {
            totalCreated: schedule?.length,
            totalPublished: schedule?.filter(i => getStatus(i) === 'published')?.length,
            totalUnpublished: schedule?.filter(i => getStatus(i) === 'unpublished')?.length,
            totalCancelled: schedule?.filter(i => getStatus(i) === 'cancelled')?.length,
            totalHappeningNow: schedule?.filter(i => getStatus(i) === 'now')?.length,
        },
        admin: {
            totalCreated: admin?.length,
            totalLoggedIn: 0
        },
    };

    return { result: { pages: result, subPages: {} } }
}

export async function pageViews(searchParams) {
    const page = searchParams.get('page');
    const startDate = searchParams.get('startDate')
    const hourlyView = searchParams.get('hourlyView')
    const pageRef = searchParams.get('page')

    const analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('ascii'))
    })

    const [response] = await analyticsDataClient.runReport({
        property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
        dateRanges: [
            {
                startDate,
                endDate: 'today',
            },
        ],
        dimensions: [
            { name: 'eventName' },
            { name: 'pagePathPlusQueryString' },
            { name: hourlyView ? 'dateHour' : 'date' },
            { name: 'deviceCategory' },
        ],
        metrics: [
            { name: 'screenPageViews' },
            { name: 'userEngagementDuration' }
        ],
        ...(page !== 'all' ? {
            dimensionFilter: {
                filter: {
                    fieldName: 'pagePathPlusQueryString',
                    ...(page === 'home'
                        ? {
                            inListFilter: {
                                values: ['/'],
                            },
                        }
                        : {
                            stringFilter: {
                                value: page,
                                matchType: 'CONTAINS',
                                caseSensitive: false
                            }
                        })
                }
            }
        } : {})
    });


    const usedDates = [];

    const finalResult = [];

    const parseDate = (date) => {
        const [day, month, year] = date?.split('-')
        return new Date(`${year}-${month}-${day}`)
    }

    response.rows?.forEach((item) => {
        const date = item?.dimensionValues[2].value;

        if (usedDates.includes(date)) return false
        //Get all the events for this date
        const events = response.rows?.filter(i => i?.dimensionValues[2].value === date);

        usedDates.push(date)

        const pageViews = events?.filter(i => i?.dimensionValues[0].value === 'page_view').reduce((accumulator, currentObject) => accumulator + Number(currentObject.metricValues[0].value), 0);

        finalResult.push({
            pageViews,
            dateTime: date,
            clicks: events?.filter(i => i?.dimensionValues[0].value === 'Click').length,
            // minutesAgo:Math.min
            label: moment(date, hourlyView ? 'YYYYMMDDhh' : 'YYYYMMDD').format(hourlyView ? 'ha, DD/MM' : 'MMM DD'),
            engagementDuration: !pageViews ? 0 : events?.filter(i => (i?.dimensionValues[0].value === 'page_view') || (i?.dimensionValues[0].value === 'user_engagement')).reduce((accumulator, currentObject) => accumulator + Number(currentObject.metricValues[1].value), 0),
        })
    })

    return { response, result: finalResult?.sort((a, b) => a?.dateTime - b?.dateTime) }
}

export async function updateHero(searchParams) {
    const banner = searchParams.get('banner');
    const heroText = searchParams.get('heroText');
    const heroSubtitle = searchParams.get('heroSubtitle');
    const pageName = searchParams.get('pageName');

    if (banner && heroText && pageName) {
        //Save the banner
        const updateBanner = (banner instanceof Blob);

        const bannerSaved = updateBanner && await upload({ file: banner, filename: banner?.name, category: 'banner' })

        const bannerName = bannerSaved?.data?.filename

        //Save the data
        await Hero.updateOne({ pageName }, {
            $set: {
                ...(updateBanner ? { banner: `banner/${bannerName}` } : {}),
                heroText, heroSubtitle
            },
        }, { upsert: true })

        return { result: 'saved' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getHeroView(searchParams) {
    const page = searchParams.get('page')

    const data = await Hero.findOne({ pageName: page });

    return { result: data };
}

export async function addLocation(searchParams) {
    const title = searchParams.get('title');
    const address = searchParams.get('address');
    const coordinate = JSON.parse(searchParams.get('coordinate'));
    const id = searchParams.get('id');

    if (id) {
        await Location.updateOne({ _id: id }, {
            title, address, coordinate
        })
    }
    else {
        await Location.create({
            title, address, coordinate
        })
    }

    return { result: 'saved' }
}

export async function getAllLocations(searchParams) {

    const data = (await Location.find()).map(i => { return { title: i?.title, id: i?._id } });

    return { result: { rows: data } };
}

export async function getOneLocation(searchParams) {
    const id = searchParams.get('id');

    const data = await Location.findOne({ _id: id });

    return { result: { id: data?._id, title: data?.title, address: data?.address, coordinate: data?.coordinate, } };
}

export async function deleteLocation(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await Location.deleteMany({ _id: id });

        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function addContactEmail(searchParams) {
    const title = searchParams.get('title');
    const password = searchParams.get('password');
    const id = searchParams.get('id');

    if (id) {
        await ContactEmail.updateOne({ _id: id }, {
            title, password
        })
    }
    else {
        const numberOfEmails = await ContactEmail.find();
        await ContactEmail.create({
            title, password, active: !Boolean(numberOfEmails.length)
        })
    }

    return { result: 'saved' }
}

export async function getAllContactEmail(searchParams) {

    const data = (await ContactEmail.find()).map(i => {
        return {
            title: i?.title,
            // actions: i?.active ? [] : ['approve'],
            status: i?.active ? 'default' : null,
            id: i?._id
        }
    });

    return { result: { rows: data } };
}

export async function getOneContactEmail(searchParams) {
    const id = searchParams.get('id');

    const data = await ContactEmail.findOne({ _id: id });

    return { result: { id: data?._id, title: data?.title, password: data?.password } };
}

export async function deleteContactEmail(searchParams) {
    const id = JSON.parse(searchParams.get('id'));


    if (id) {
        const remaining = await ContactEmail.find();
        if (remaining?.length !== id?.length) {
            await ContactEmail.deleteMany({ _id: id });

            //Get the active email
            const emails = await ContactEmail.find()

            if (((remaining?.length - id?.length) === 1) || !emails?.find(i => i?.active)) {
                //Set one email as active
                await ContactEmail.updateOne({ _id: emails[0]?._id?.toString() }, { $set: { active: true } })
            }

            return { result: 'deleted' }
        }
        else {
            return { error: 'You cannot delete all emails. There should be at least one email available' }
        }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}

export async function getResourcesForMapping(searchParams) {
    const date = searchParams.get('date');

    const resources = await Resource.find({ date })

    //Get the speakers whose id is in the resource
    const speakers = await GuestSpeaker.find({ _id: resources?.map(i => i?.speaker) });

    const conferences = await Conference.find({ _id: resources?.filter(i => i?.conferences)?.map(i => i?.conferences) });

    const parseDate = (date) => {
        const [day, month, year] = date?.split('/')
        return new Date(`${year}-${month}-${day}`)
    }

    //Process data
    const data = resources?.sort((a, b) => parseDate(a?.date) - parseDate(b?.date)).map(i => {
        const media = {
            audio: i?.audio, video: i?.video, audioDownload: i?.audioDownload?.length && generateFileUrl(i?.audioDownload),
            documentDownload: i?.documentDownload?.length && generateFileUrl(i?.documentDownload)
        };

        return {
            ...(i?.toObject()), date: moment(i?.date || new Date()).format('DD/MM/yyyy'),
            id: i?._id,
            conference: conferences?.find(it => it?._id?.toString() === i?.conferences)?.sectionTitle,
            media, speaker: speakers?.find(it => it?._id?.toString() === i?.speaker)?.name,
            actions: media,
        }
    });

    return { result: data }

}

export async function mapToResource(searchParams) {
    const scheduleId = searchParams.get('scheduleId');
    const resourceId = searchParams.get('resourceId');

    await Schedule.updateOne({ _id: scheduleId }, { $set: { resourceId } })

    return { result: 'saved' }
}

export async function removeMapping(searchParams) {
    const scheduleId = searchParams.get('scheduleId');

    await Schedule.updateOne({ _id: scheduleId }, { $set: { resourceId: null } })

    return { result: 'saved' }
}

export async function setEmailAsDefault(searchParams) {
    const id = searchParams.get('id');

    await ContactEmail.updateOne({ _id: id }, { $set: { active: true } })
    await ContactEmail.updateOne({ _id: { $nin: [(new mongoose.Types.ObjectId(id))] } }, { $set: { active: false } })

    return { result: 'saved' }
}

export async function getDataForResourceIndex(searchParams) {
    const guestSpeakers = (await GuestSpeaker.find())?.map(i => { return { id: i?._id, name: i?.name, image: i?.image && generateFileUrl(i?.image) } });

    const bibleCharacters = (await BibleCharacter.find())?.filter(i => i?.name).map(i => i?.name)

    const topicalStudies = (await TopicalStudy.find()).map(i => { return { id: i?._id, name: i?.sectionTitle } })

    const conferences = await Conference.find();

    const conferenceGrouped = {};

    conferences.forEach(i => conferenceGrouped[i?.sectionTitle]
        ? conferenceGrouped[i?.sectionTitle].push({ id: i?._id, name: i?.name })
        : conferenceGrouped[i?.sectionTitle] = [{ id: i?._id, name: i?.name }])

    return { result: { guestSpeakers, bibleCharacters, topicalStudies, conferences: conferenceGrouped } }
}

export async function getSignedUploadUrl(searchParams) {
    const filename = searchParams.get('filename')
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Expires: 200,
        Key: filename
    }

    return s3.getSignedUrlPromise('putObject', params).then(
        (url, err) => {
            if (err) {
                return { error: 'Something went wrong' }
            }
            else {
                return { result: url }
            }
        })


}

export async function addLiveLink(searchParams) {
    const title = searchParams.get('title');
    const link = searchParams.get('link');
    const id = searchParams.get('id');

    if (id) {
        await LiveLink.updateOne({ _id: id }, {
            title, link
        })
    }
    else {
        await LiveLink.create({
            title, link
        })
    }

    return { result: 'saved' }
}

export async function getAllLiveLinks(searchParams) {

    const data = (await LiveLink.find()).map(i => {
        return {
            title: i?.title,
            link: i?.link,
            id: i?._id
        }
    });

    return { result: { rows: data } };
}

export async function getOneLiveLink(searchParams) {
    const id = searchParams.get('id');

    const data = await LiveLink.findOne({ _id: id });

    return { result: { ...data?.toObject(), id: data?._id, } };
}

export async function deleteLiveLink(searchParams) {
    const id = JSON.parse(searchParams.get('id'));

    if (id) {
        await LiveLink.deleteMany({ _id: id });
        return { result: 'deleted' }
    }
    else {
        return { error: 'Some required fields are missing' }
    }
}