
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import {
    addBibleCharacter,
    addBibleCharacterSection,
    addConference,
    addConferenceCategory,
    addContactEmail,
    addLiveLink,
    addLocation,
    addPrayerRequestTopic,
    addResource,
    addResourceMinistry,
    addSchedule,
    addTopicalStudy,
    cancelSchedule,
    changePassword,
    deleteAdmin,
    deleteBibleCharacter,
    deleteBibleCharacterSection,
    deleteConference,
    deleteConferenceItem,
    deleteContactEmail,
    deleteLiveLink,
    deleteLocation,
    deleteMessage,
    deletePrayerRequestTopic,
    deleteResource,
    deleteResourceMinistry,
    deleteSchedule,
    deleteSpeaker,
    deleteTopicalStudy,
    getAdminIndex,
    getAdminView,
    getAllContactEmail,
    getAllLiveLinks,
    getAllLocations,
    getAllMessages,
    getAllMetaInformation,
    getAllPrayerRequestTopics,
    getAllResources,
    getAllSchedule,
    getBibleCharacterView,
    getConferenceView,
    getDataForContactForm,
    getDataForNewResource,
    getDataForNewSchedule,
    getDataForResourceIndex,
    getFaithView,
    getGuestSpeakerView,
    getHeader,
    getHeroView,
    getHistoryView,
    getHomePageView,
    getImageURL,
    getLeadershipView,
    getMinistryView,
    getOneContactEmail,
    getOneContactForm,
    getOneLiveLink,
    getOneLocation,
    getOneMessage,
    getOneMetaInformation,
    getOnePrayerRequestTopic,
    getOneResource,
    getOneSchedule,
    getResourceMinistryView,
    getResourcesForMapping,
    getSignedUploadUrl,
    getTopicalStudyView,
    handleCheckLoginStatus, handleLogOut, handleLogin, handleTokenRequest, handleVerifyToken, mapToResource, markAsRead, markAsUnread, minutesAgoGA, pageViews, publishResource, publishSchedule, removeMapping, resendToken, searchCMS, sections, sendReply, setEmailAsDefault, unpublishResource, unpublishSchedule, updateAdmin, updateContactForm, updateFaith, updateFooter, updateGuestSpeakers, updateHeader, updateHero, updateHistory, updateHomepage, updateLeadership, updateMeta, updateMinistry,
} from "./routeHandlers";

export const dynamic = "force-dynamic"

export async function isLoggedIn() {
    const loggedIn = await handleCheckLoginStatus();
    return loggedIn?.result
}

const loginAuth = { authErr: 'login', authUrl: '/login', type: 'login' }

const loginRequiredEvent = async (callback, params) => {
    const loggedIn = await isLoggedIn()
    if (loggedIn) {
        const response = await callback(params)
        console.log('response in login', response)
        return await response;
    }
    else {
        return { loginRedirect: true }
    }
}

export async function GET(req, { params }) {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('connected')
        }
        else {
            console.log('connecting to db')
            const dbName = process.env.DB_NAME //(process.env.NODE_ENV === 'production') ? 'calvary' : 'calvaryTest';

            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI

            await mongoose.connect(URI, { dbName: dbName })
        }

        const route = params.rootPath;

        const { searchParams } = new URL(req.url);

        let response;

        switch (route) {
            case 'check-status':
                response = await handleCheckLoginStatus(searchParams);
                return NextResponse.json(response)
            case 'log-out':
                response = await handleLogOut(searchParams);
                return NextResponse.json(response)
            case 'token-request':
                response = await handleTokenRequest(searchParams);
                return NextResponse.json(response)
            case 'resend-token':
                response = await resendToken(searchParams);
                return NextResponse.json(response)
            case 'search':
                response = await searchCMS(searchParams);
                return NextResponse.json(response)
            case 'ministry':
                return NextResponse.json(await loginRequiredEvent(getMinistryView, searchParams))
            case 'history':
                return NextResponse.json(await loginRequiredEvent(getHistoryView, searchParams))
            case 'faith':
                return NextResponse.json(await loginRequiredEvent(getFaithView, searchParams))
            case 'leadership':
                return NextResponse.json(await loginRequiredEvent(getLeadershipView, searchParams))
            case 'admins':
                return NextResponse.json(await loginRequiredEvent(getAdminIndex, searchParams))
            case 'admin-view':
                return NextResponse.json(await loginRequiredEvent(getAdminView, searchParams))
            case 'homepage':
                return NextResponse.json(await loginRequiredEvent(getHomePageView, searchParams))
            case 'guest-speakers':
                return NextResponse.json(await loginRequiredEvent(getGuestSpeakerView, searchParams))
            case 'delete-guest-speaker':
                return NextResponse.json(await loginRequiredEvent(deleteSpeaker, searchParams))
            case 'bible-character':
                return NextResponse.json(await loginRequiredEvent(getBibleCharacterView, searchParams))
            case 'delete-bible-character-section':
                return NextResponse.json(await loginRequiredEvent(deleteBibleCharacterSection, searchParams))
            case 'delete-bible-character':
                return NextResponse.json(await loginRequiredEvent(deleteBibleCharacter, searchParams))
            case 'topical-study':
                return NextResponse.json(await loginRequiredEvent(getTopicalStudyView, searchParams))
            case 'delete-topical-study':
                return NextResponse.json(await loginRequiredEvent(deleteTopicalStudy, searchParams))
            case 'conference':
                return NextResponse.json(await loginRequiredEvent(getConferenceView, searchParams))
            case 'delete-conference':
                return NextResponse.json(await loginRequiredEvent(deleteConference, searchParams))
            case 'delete-conference-category':
                return NextResponse.json(await loginRequiredEvent(deleteConferenceItem, searchParams))
            case 'resource-ministry':
                return NextResponse.json(await loginRequiredEvent(getResourceMinistryView, searchParams))
            case 'delete-resource-ministry':
                return NextResponse.json(await loginRequiredEvent(deleteResourceMinistry, searchParams))
            case 'data-for-new-schedule':
                return NextResponse.json(await loginRequiredEvent(getDataForNewSchedule, searchParams))
            case 'all-schedule':
                return NextResponse.json(await loginRequiredEvent(getAllSchedule, searchParams))
            case 'schedule-view':
                return NextResponse.json(await loginRequiredEvent(getOneSchedule, searchParams))
            case 'all-resources':
                return NextResponse.json(await loginRequiredEvent(getAllResources, searchParams))
            case 'data-for-new-resource':
                return NextResponse.json(await loginRequiredEvent(getDataForNewResource, searchParams))
            case 'resource-view':
                return NextResponse.json(await loginRequiredEvent(getOneResource, searchParams))
            case 'all-prayer-request-topics':
                return NextResponse.json(await loginRequiredEvent(getAllPrayerRequestTopics, searchParams))
            case 'prayer-request-topic-view':
                return NextResponse.json(await loginRequiredEvent(getOnePrayerRequestTopic, searchParams))
            case 'contact-form':
                return NextResponse.json(await loginRequiredEvent(getOneContactForm, searchParams))
            case 'data-for-contact-form':
                return NextResponse.json(await loginRequiredEvent(getDataForContactForm, searchParams))
            case 'messages':
                return NextResponse.json(await loginRequiredEvent(getAllMessages, searchParams))
            case 'message-view':
                return NextResponse.json(await loginRequiredEvent(getOneMessage, searchParams))
            case 'all-meta':
                return NextResponse.json(await loginRequiredEvent(getAllMetaInformation, searchParams))
            case 'meta-view':
                return NextResponse.json(await loginRequiredEvent(getOneMetaInformation, searchParams))
            case 'header-footer':
                return NextResponse.json(await loginRequiredEvent(getHeader, searchParams))
            case 'minutes-ago':
                return NextResponse.json(await loginRequiredEvent(minutesAgoGA, searchParams))
            case 'sections':
                return NextResponse.json(await loginRequiredEvent(sections, searchParams))
            case 'pageviews':
                return NextResponse.json(await loginRequiredEvent(pageViews, searchParams))
            case 'hero':
                return NextResponse.json(await loginRequiredEvent(getHeroView, searchParams))
            case 'location-view':
                return NextResponse.json(await loginRequiredEvent(getOneLocation, searchParams))
            case 'all-locations':
                return NextResponse.json(await loginRequiredEvent(getAllLocations, searchParams))
            case 'all-contact-email':
                return NextResponse.json(await loginRequiredEvent(getAllContactEmail, searchParams))
            case 'contact-email-view':
                return NextResponse.json(await loginRequiredEvent(getOneContactEmail, searchParams))
            case 'resource-for-mapping':
                return NextResponse.json(await loginRequiredEvent(getResourcesForMapping, searchParams))
            case 'set-default-contact-form-email':
                return NextResponse.json(await loginRequiredEvent(setEmailAsDefault, searchParams))
            case 'data-for-resource-index':
                return NextResponse.json(await loginRequiredEvent(getDataForResourceIndex, searchParams))
            case 'get-signed-url':
                return NextResponse.json(await loginRequiredEvent(getSignedUploadUrl, searchParams))
            case 'all-live-link':
                return NextResponse.json(await loginRequiredEvent(getAllLiveLinks, searchParams))
            case 'live-link-view':
                return NextResponse.json(await loginRequiredEvent(getOneLiveLink, searchParams))
            case 'image':
                return NextResponse.json(await loginRequiredEvent(getImageURL, searchParams))
            default:
                return NextResponse.json({ error: 'not found' })
        }

    } catch (error) {
        console.log('something went wrong', error)
        return NextResponse.json({ errMsg: 'Something went wrong' })
    }

}

export async function POST(req, { params }) {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('connected')
        }
        else {
            console.log('connecting to db')
            const dbName = process.env.DB_NAME //(process.env.NODE_ENV === 'production') ? 'calvary' : 'calvaryTest';

            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI

            await mongoose.connect(URI, { dbName: dbName })
        }

        const route = params.rootPath;

        const payload = await req.formData();

        let response;

        switch (route) {
            case 'login':
                response = await handleLogin(payload);
                return NextResponse.json(response);
            case 'verify-token':
                response = await handleVerifyToken(payload);
                return NextResponse.json(response);
            case 'change-password':
                response = await changePassword(payload);
                return NextResponse.json(response);
            case 'update-ministry':
                return NextResponse.json(await loginRequiredEvent(updateMinistry, payload))
            case 'update-history':
                return NextResponse.json(await loginRequiredEvent(updateHistory, payload))
            case 'update-faith':
                return NextResponse.json(await loginRequiredEvent(updateFaith, payload))
            case 'update-leadership':
                return NextResponse.json(await loginRequiredEvent(updateLeadership, payload))
            case 'update-admin':
                return NextResponse.json(await loginRequiredEvent(updateAdmin, payload))
            case 'update-homepage':
                return NextResponse.json(await loginRequiredEvent(updateHomepage, payload))
            case 'update-guest-speaker':
                return NextResponse.json(await loginRequiredEvent(updateGuestSpeakers, payload))
            case 'delete-admin':
                return NextResponse.json(await loginRequiredEvent(deleteAdmin, payload))
            case 'add-bible-character':
                return NextResponse.json(await loginRequiredEvent(addBibleCharacter, payload))
            case 'add-bible-character-section':
                return NextResponse.json(await loginRequiredEvent(addBibleCharacterSection, payload))
            case 'add-topical-study':
                return NextResponse.json(await loginRequiredEvent(addTopicalStudy, payload))
            case 'add-conference':
                return NextResponse.json(await loginRequiredEvent(addConference, payload))
            case 'add-conference-category':
                return NextResponse.json(await loginRequiredEvent(addConferenceCategory, payload))
            case 'add-resource-ministry':
                return NextResponse.json(await loginRequiredEvent(addResourceMinistry, payload))
            case 'add-schedule':
                return NextResponse.json(await loginRequiredEvent(addSchedule, payload))
            case 'delete-schedule':
                return NextResponse.json(await loginRequiredEvent(deleteSchedule, payload))
            case 'publish-schedule':
                return NextResponse.json(await loginRequiredEvent(publishSchedule, payload))
            case 'unpublish-schedule':
                return NextResponse.json(await loginRequiredEvent(unpublishSchedule, payload))
            case 'cancel-schedule':
                return NextResponse.json(await loginRequiredEvent(cancelSchedule, payload))
            case 'add-resource':
                return NextResponse.json(await loginRequiredEvent(addResource, payload))
            case 'delete-resource':
                return NextResponse.json(await loginRequiredEvent(deleteResource, payload))
            case 'publish-resource':
                return NextResponse.json(await loginRequiredEvent(publishResource, payload))
            case 'unpublish-resource':
                return NextResponse.json(await loginRequiredEvent(unpublishResource, payload))
            case 'add-prayer-request-topic':
                return NextResponse.json(await loginRequiredEvent(addPrayerRequestTopic, payload))
            case 'delete-prayer-request-topic':
                return NextResponse.json(await loginRequiredEvent(deletePrayerRequestTopic, payload))
            case 'update-contact-form':
                return NextResponse.json(await loginRequiredEvent(updateContactForm, payload))
            case 'delete-message':
                return NextResponse.json(await loginRequiredEvent(deleteMessage, payload))
            case 'send-reply':
                return NextResponse.json(await loginRequiredEvent(sendReply, payload))
            case 'mark-as-read':
                return NextResponse.json(await loginRequiredEvent(markAsRead, payload))
            case 'mark-as-unread':
                return NextResponse.json(await loginRequiredEvent(markAsUnread, payload))
            case 'update-meta':
                return NextResponse.json(await loginRequiredEvent(updateMeta, payload))
            case 'update-header':
                return NextResponse.json(await loginRequiredEvent(updateHeader, payload))
            case 'update-footer':
                return NextResponse.json(await loginRequiredEvent(updateFooter, payload))
            case 'update-hero':
                return NextResponse.json(await loginRequiredEvent(updateHero, payload))
            case 'add-location':
                return NextResponse.json(await loginRequiredEvent(addLocation, payload))
            case 'delete-location':
                return NextResponse.json(await loginRequiredEvent(deleteLocation, payload))
            case 'add-contact-email':
                return NextResponse.json(await loginRequiredEvent(addContactEmail, payload))
            case 'delete-contact-email':
                return NextResponse.json(await loginRequiredEvent(deleteContactEmail, payload))
            case 'map-to-resource':
                return NextResponse.json(await loginRequiredEvent(mapToResource, payload))
            case 'remove-mapping':
                return NextResponse.json(await loginRequiredEvent(removeMapping, payload))
            case 'add-live-link':
                return NextResponse.json(await loginRequiredEvent(addLiveLink, payload))
            case 'delete-live-link':
                return NextResponse.json(await loginRequiredEvent(deleteLiveLink, payload))
            default:
                return NextResponse.json({ error: 'not found' })
        }
    } catch (error) {
        console.log('something went wrong', error)
        return NextResponse.json({ errMsg: 'Something went wrong' })
    }
}
