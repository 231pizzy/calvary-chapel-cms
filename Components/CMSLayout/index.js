'use client'

import { useEffect, useState } from "react"
import MainSpinner from "../MainSpinner";
import Label from "../Label/Label";
import Image from "../Image";
import { usePathname, useRouter } from "next/navigation";
import { Box, Button, InputAdornment, OutlinedInput } from "@mui/material";
import { CheckListSvg, ContactBibleSvg, ContactFormSvg, EnquirySvg, HeaderFooterSvg, MetaSvg, PageSvg, SettingIcon, SettingSvg, SiteLogoSvg } from "@/public/icons/icons";
import { DashboardSvg } from "@/public/icons/icons";
import { HomePageSvg } from "@/public/icons/icons";
import { MinistrySvg } from "@/public/icons/icons";
import { YouthSvgDyn } from "@/public/icons/icons";
import { MenSvgDyn } from "@/public/icons/icons";
import { WomenSvgDyn } from "@/public/icons/icons";
import { ChildrenSvgDyn } from "@/public/icons/icons";
import { ResourceSvg } from "@/public/icons/icons";
import { AboutSvg } from "@/public/icons/icons";
import { ScheduleSvg } from "@/public/icons/icons";
import { ContactSvg } from "@/public/icons/icons";
import { AdminSvg } from "@/public/icons/icons";
import { LogOutSvg } from "@/public/icons/icons";
import { OpenCaret } from "@/public/icons/icons";
import { CaretRight } from "@/public/icons/icons";
import { GuestSpeakerDynSvg } from "@/public/icons/icons";
import { BibleDynSvg } from "@/public/icons/icons";
import { TopicalStudiesDynSvg } from "@/public/icons/icons";
import { ConferenceDynSvg } from "@/public/icons/icons";
import { NoteSvgDyn } from "@/public/icons/icons";
import { FaithSvgDyn } from "@/public/icons/icons";
import { LeadershipSvgDyn } from "@/public/icons/icons";
import { ClosedCaret } from "@/public/icons/icons";
import LogOut from "@/app/(admin)/logout/Component";
import CMSSearch from "../Search/CMSSearch";

export const icons = (size) => {
    return {
        dashboard: <DashboardSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        homePage: <HomePageSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        homepage: <HomePageSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        ministry: <MinistrySvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        youthMinistry: <YouthSvgDyn style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        menMinistry: <MenSvgDyn style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        womenMinistry: <WomenSvgDyn style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        childrenMinistry: <ChildrenSvgDyn style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        resources: <ResourceSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        guestSpeaker: <GuestSpeakerDynSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        bibleCharacter: <BibleDynSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        topicalCharacter: <TopicalStudiesDynSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        conferences: <ConferenceDynSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        ministry: <MinistrySvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        history: <NoteSvgDyn style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        faith: <FaithSvgDyn style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        leadership: <LeadershipSvgDyn style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        about: <AboutSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        schedule: <ScheduleSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        contact: <ContactSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        admin: <AdminSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        prayerRequest: <FaithSvgDyn style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        contactForm: <ContactFormSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        enquiries: <EnquirySvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        meta: <MetaSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        headerFooter: <HeaderFooterSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        page: <PageSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        setting: <SettingIcon style={{ height: size ?? '20px', width: size ?? '20px' }} />,
        //  admin: <AdminSvg style={{ height: size ?? '20px', width: size ?? '20px' }} />,
    }
}

export const sidebarItems = [
    { label: 'Dashboard', id: 'dashboard', url: '/admin', icon: icons()['dashboard'] },
    {
        label: 'Pages', id: 'page', url: '/admin/page', icon: icons()['page'],
        children: [
            { label: 'Homepage', id: 'homepage', url: '/admin/homepage', icon: icons()['homePage'], },
            { label: 'Ministry', id: 'ministry', url: '/admin/ministry/men-ministry', icon: icons()['ministry'], },
            { label: 'Resources', id: 'resources', url: '/admin/resources/hero?page=verse-by-verse', icon: icons()['resources'], },
            { label: 'Schedule', id: 'schedule', url: '/admin/schedule/hero', icon: icons()['schedule'], },
            { label: 'About CCT', id: 'about', url: '/admin/about/history', icon: icons()['about'], },
            { label: 'Contact', id: 'contact', url: '/admin/contact/contact-form', icon: icons()['contact'], }
        ]
    },
    { label: 'Resources', id: 'resources', url: '/admin/resources/all-resources', icon: icons()['resources'], },
    { label: 'Schedule', id: 'schedule', url: '/admin/schedule', icon: icons()['schedule'], },
    { label: 'Contact Enquiries', id: 'contact', url: '/admin/contact', icon: icons()['contact'], },
    { label: 'Admin', id: 'admin', url: '/admin/admin', icon: icons()['admin'], },
    { label: 'Settings', id: 'settings', url: '/admin/header', icon: icons()['setting'], },

    /*   {
          label: 'Ministry', id: 'ministry', url: '/admin/ministry', icon: icons()['ministry'],
          children: [
              { label: `Men's Ministry`, id: 'men-ministry', url: '/admin/ministry/men-ministry', icon: icons()['menMinistry'], },
              { label: `Women's Ministry`, id: 'women-ministry', url: '/admin/ministry/women-ministry', icon: icons()['womenMinistry'], },
              { label: `Youth's Ministry`, id: 'youth-ministry', url: '/admin/ministry/youth-ministry', icon: icons()['youthMinistry'], },
              { label: `Children's Ministry`, id: 'children-ministry', url: '/admin/ministry/children-ministry', icon: icons()['childrenMinistry'], },
          ]
      }, */
    /*   {
          label: 'Resources', id: 'resources', url: '/admin/resources', icon: icons()['resources'],
          children: [
              { label: `All Resources`, id: 'all-resources', url: '/admin/resources/all-resources', icon: icons()['resources'], },
              { label: `Guest Speakers`, id: 'guest-speakers', url: '/admin/resources/guest-speakers', icon: icons()['guestSpeaker'], },
              { label: `Bible Character`, id: 'bible-characters', url: '/admin/resources/bible-characters', icon: icons()['bibleCharacter'], },
              { label: `Topical Character`, id: 'topical-characters', url: '/admin/resources/topical-characters', icon: icons()['topicalCharacter'], },
              { label: `Conferences`, id: 'conferences', url: '/admin/resources/conferences', icon: icons()['conferences'], },
              // { label: `Ministry`, id: 'resource-ministry', url: '/admin/resources/ministry', icon: icons()['ministry'], },
          ]
      }, */
    /*  {
         label: 'About CCT', id: 'about', url: '/admin/about', icon: icons()['about'],
         children: [
             { label: `History of CCT`, id: 'history', url: '/admin/about/history', icon: icons()['history'], },
             { label: `Statement Of Faith`, id: 'faith', url: '/admin/about/faith', icon: icons()['faith'], },
             { label: `Leadership`, id: 'leadership', url: '/admin/about/leadership', icon: icons()['leadership'], },
         ]
     }, */
    //  { label: 'Schedule', id: 'schedule', url: '/admin/schedule', icon: icons()['schedule'], },
    /*  {
         label: 'Contact', id: 'contact', url: '/admin/contact', icon: icons()['contact'],
         children: [
             { label: `Contact Form`, id: 'contact-form', url: '/admin/contact/contact-form', icon: icons()['contactForm'], },
             { label: `Enquiries`, id: 'enquiries', url: '/admin/contact', icon: icons()['enquiries'], },
             { label: `Prayer Request Topics`, id: 'prayer-requests', url: '/admin/contact/prayer-request-topics', icon: icons()['prayerRequest'], },
         ]
     },
     { label: 'Header & Footer', id: 'headerFooter', url: '/admin/header-footer', icon: icons()['headerFooter'], },
     { label: 'Admin', id: 'admin', url: '/admin/admin', icon: icons()['admin'], },
     { label: 'Meta Information', id: 'meta', url: '/admin/meta', icon: icons()['meta'], }, */
]

export default function CMSLayout({ children, menuId, subMenuId, pageTitle, searchEndpoint, searchResultUrl,
    headComponentArray }) {
    const router = useRouter();
    const pathname = usePathname();

    const [allowUser, setAllowUser] = useState(true)
    const [subMenuOpen, setSubMenuOpen] = useState(menuId);
    const [searchResult, setSearchResult] = useState(null);
    const [filterSearchBy, setFilterSearchBy] = useState(null)

    const [logout, setLogout] = useState(false);

    useEffect(() => {
        //    console.log('user at cms', user)

        /*   fetch('/api/user/me', { method: 'GET' }).then(
              async response => {
                  const data = await response.json();
                  if (data?.isAdmin) {
                      setAllowUser(true)
                  }
                  else {
                      router.replace('/');
                  }
              },
              err => {
                  console.log('error in admin layout', err)
              }
          ) */
        /*  if (!user?.isAdmin) router.replace('/');
         else setAllowUser(true) */
    }, [])

    useEffect(() => {
        const listener = (event) => {
            if (!document.getElementById('search-panel')?.contains(event.target)) {
                console.log('clicked outside')
                setSearchResult(null);
                setFilterSearchBy(null);
            }
        }

        if (searchResult) {
            document.addEventListener('click', listener)
        }

        return () => {
            document.removeEventListener('click', listener)
        }
    }, [searchResult])

    const handleOpenSubMenu = () => {
        setSubMenuOpen(true)
    }

    const handleCloseSubMenu = () => {
        setSubMenuOpen(false)
    }

    const handleLogout = () => {
        setLogout(true)
    }

    const handleCancelLogout = () => {
        setLogout(false)
    }

    const handleMenuClick = (id, hasSubMenu, url) => {
        console.log('menu has been clicked', { id, hasSubMenu, url, menuId, subMenuOpen })
        if (id === menuId) {
            if (hasSubMenu) {
                setSubMenuOpen(subMenuOpen ? null : id);
            }
            else {
                window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL_MAIN}${url}`
                //router.push(url)
            }
        }
        else {
            if (hasSubMenu) {
                setSubMenuOpen(subMenuOpen ? subMenuOpen === id ? null : id : id);
            }
            else {
                url && (window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL_MAIN}${url}`)//router.push(url)
            }
        }
    }

    const handleSubMenuClick = ({ id, url }) => {
        setSearchResult(null);
        setFilterSearchBy(null);

        url && setTimeout(() => {
            window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL_MAIN}${url}` //router.push(url)
        }, 100)

    }

    const openedCaret = <OpenCaret style={{ width: '12px', height: '12px', color: '#D5D5D5' }} />

    const closedCaret = <ClosedCaret style={{ width: '12px', height: '12px', color: '#D5D5D5' }} />

    const caretRight = <CaretRight style={{ margin: '0px 8px', width: '8px', height: '8px', color: '#D5D5D5' }} />

    const handleSearch = (event) => {
        const value = event.currentTarget.value;

        if (value) {
            fetch(`/api/cms/search?data=${encodeURIComponent(value)}`, { method: 'GET', }).then(
                async response => {
                    const { data, loginRedirect } = await response.json();
                    loginRedirect && window.location.replace('/login')
                    if (data) {
                        setSearchResult(data)
                    }
                },
                err => {
                    console.log('error in admin layout', err)
                }
            )
        }
        else {
            setSearchResult(null)
        }

    };

    const handleSearchClick = (id, endpoint) => {
        pathname === searchResultUrl
            ? (window.location.href = `${endpoint}?id=${id}`) : router.push(`${endpoint}?id=${id}`)
    }

    const ButtonIcon = ({ item, index, background, color }) => {
        return <div key={index} onClick={() => { handleMenuClick(item.id, Boolean(item?.children), item.url) }}
            style={{
                display: 'flex', alignItems: 'center', minWidth: 'max-content',
                color: 'white', padding: '12px 8px 12px 15px',
                background: background ?? (item.id === menuId ? '#397C95' : '#2F687E'), cursor: 'pointer',
            }}
        >
            <Label
                label={item.label}
                color={'white'}
                iconLeft={item.icon}
                type="tiny"
                style={{ mx: 1.5, }}
            />

            {Boolean(item.children) && (
                subMenuOpen === item.id ? openedCaret : closedCaret
            )}
        </div>
    }

    const filterSearchResult = (id) => {
        setFilterSearchBy(id)
    }


    return <div style={{
        minHeight: '100vh', maxHeight: '100vh', overflowY: 'hidden', width: '100vw', display: 'flex',
    }}>
        {/* Side bar */}
        <div style={{
            minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto', backgroundColor: '#002F65',
            /* minWidth: 'max-content', */ /* minWidth: '200px', */ width: '200px' /* 'max-content' */, display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Site logo */}
            <div onClick={() => { router.push('/admin') }} style={{
                display: 'flex', alignItems: 'center', background: '#0E60BF',
                height: '60px', maxHeight: '60px', padding: '0 4px 0 12px', cursor: 'pointer'
            }}>
                <SiteLogoSvg style={{ color: 'white', height: '30px', width: '30px' }} />
                <Label
                    type="heading3"
                    label='CCTurku CMS'
                    color='#EDEAE4'
                    style={{ maxWidth: '100px', marginLeft: '12px', minWidth: 'max-content' }}
                />
            </div>

            {/* Button list */}
            <div>
                {sidebarItems.map((item, index) => {
                    return <div key={index} style={{
                        minWidth: 'max-content',
                    }}>
                        <ButtonIcon
                            background={menuId === item.id ? '#023C81' : '#002F65'}
                            item={item} index={index}
                        />

                        {subMenuOpen === item.id && Boolean(item.children)
                            && <div style={{
                                margin: '0 3px 4px 24px',
                                display: 'flex'
                            }}>
                                <div>
                                    {item.children.map((child, indx) => {
                                        return <div
                                            onClick={() => { handleSubMenuClick({ id: child.id, url: child.url }) }}
                                            key={indx} style={{
                                                display: 'flex', height: 'max-content', cursor: 'pointer',
                                                alignItems: 'center', padding: '6px 0'
                                            }}>
                                            <Label
                                                type="tiny"
                                                color={'white'}
                                                iconLeft={child.icon}
                                                containerStyle={{
                                                    bgcolor: subMenuId === child.id ? '#1C3554' : '#0A2342',
                                                    px: 1, py: .5, borderRadius: '12px'
                                                }}
                                                label={child.label}
                                                style={{
                                                    pl: 1.5,
                                                }}
                                            />
                                        </div>
                                    })}
                                </div>

                            </div>}
                    </div>

                })}
            </div>

            <div style={{ flexGrow: 1 }} />
            {/* Logout  button */}
            <div style={{ marginTop: 'auto' }} onClick={handleLogout}>
                <ButtonIcon background='#0E60BF' color='#E76881'
                    item={{
                        icon: <LogOutSvg style={{ height: '14px', width: '14px' }} />,
                        label: 'Log Out', id: 'logout'
                    }}
                    index={53}
                />
            </div>

        </div>

        <div style={{
            minHeight: '100vh', maxHeight: '100vh', overflowY: 'hidden',
            minWidth: 'calc(100vw - 200px)', maxWidth: 'calc(100vw - 200px)', background: 'white'
        }}>
            {/* Header */}
            <div style={{
                minWidth: 'calc(100vw - 228px)', maxWidth: 'calc(100vw - 228px)', height: '60px',
                maxHeight: '60px', textTransform: 'capitalize',
                display: 'flex', alignItems: 'center', borderBottom: '2px solid #1C1D221A', padding: '0px 14px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {pageTitle?.split('/').map((item, index) => {
                        return index == 0 ?
                            <Label
                                type="heading2"
                                key={index}
                                label={item}
                                style={{
                                    display: 'flex', alignItems: 'center', color: '#0E60BF',
                                    textTransform: 'capitalize', minWidth: 'max-content'
                                }}
                            />
                            : <Label
                                label={item}
                                key={index}
                                iconLeft={caretRight}
                                type="heading4"
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    textTransform: 'capitalize'
                                }}
                            />
                    })}
                </div>

                <div style={{ flexGrow: 1, }} />

                {/* Head component array */}
                {headComponentArray && <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    {headComponentArray?.map((component, index) => {
                        return <Box key={index} sx={{ mr: 1 }}>
                            {component}
                        </Box>
                    })}
                </Box>}

                <CMSSearch />

                {/*   <Image
                    diameter={30}
                    style={{ cursor: 'pointer', }}
                    url={null}
                /> */}
            </div>

            {/* Body */}
            <div style={{
                height: 'calc(100vh - 60px)', background: 'white', minWidth: '100%', maxWidth: '100%', overflowY: 'auto'
            }}>
                {!allowUser ?
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
                        <MainSpinner />
                    </div>
                    : children
                }
            </div>
        </div>


        {logout && <LogOut handleCancel={handleCancelLogout} showLogOutPrompt={logout} />}

    </div>
}