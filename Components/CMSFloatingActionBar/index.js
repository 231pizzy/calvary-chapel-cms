import { useState } from "react";
import { useRouter } from "next/navigation";
import CloseIcon from '@mui/icons-material/Close';
import Visibility from "@mui/icons-material/Visibility";
import { Button, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import WarningModal from '@/Components/WarningModal/WarningModal'
import { postRequestHandler2 } from "../requestHandler";
import ModalMessage from "../ModalMessage/ModalMessage";

/* export const IconButton = ({ iconLeft, iconRightProps, label, iconRight, iconLeftProps, background,
    onClick, color, marginLeft, marginRight }) => {
    return <span style={{
        padding: '4px 8px', background: background ?? '#F5F5F5', border: '1px solid #1414171A', display: 'flex', color,
        alignItems: 'center', borderRadius: '8px', fontWeight: 500, fontSize: '11px', cursor: 'pointer',
        marginRight, marginLeft
    }} onClick={onClick}>
        {iconLeft && SVG({ name: iconLeft, ...iconLeftProps })}
        {label}
        {iconRight && SVG({ name: iconRight, ...iconRightProps })}
    </span>
}
 */





export default function CMSFloatingActionBar({ selectItemsRows, exportToPdf, title, handleCancelSelection,
    floatingActions, viewUrl, editUrl, exportToExcel, forkOutDraft, read, replied, deleteEndpoint, draft, username,
    notifyUrl, replyUrl, markAsReadEndpoint, markAsUnreadEndpoint, publishEndpoint, unpublishEndpoint, published,
    dataEndpoint, downloadHeadingArray, downloadCellRenderer, siteSettings, downloadCellWidths, cancelled,
    downloadColumnIds, eligible, votingEligible, zipExportColumnArray, zipExportTitle, zipExportFormat,
    zipExportEndpoint, zipExportSections, cancelEndpoint, defaultEmail, includesJustConcluded, includesConcluded }) {
    const router = useRouter();
    // const form = useForm();

    const IconButton = ({ handleClick, label, iconRight, iconLeft, background }) => {
        return <Button sx={{
            fontSize: 11, mx: 1, py: .5, px: 1, maxWidth: 'max-content', minWidth: 0,
            bgcolor: background ?? '#F5F5F5', border: '1px solid #1414171A', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#364451', borderRadius: '8px'
        }} onClick={handleClick}>
            {iconLeft}  {label} {iconRight}
        </Button>
    }

    const form = {
        submit: async () => {

        },
        status: 'default'
    }

    //Floating action options: 'exportPdf', 'exportExcel', 'publish','unpublish', 'delete', 'notify',
    const [showPublishAllWarning, setShowPublishAllWarning] = useState(false);
    const [showUnpublishAllWarning, setShowUnpublishAllWarning] = useState(false);
    const [showDraftWarning, setShowDraftWarning] = useState(false);
    const [showDeleteAllWarning, setShowDeleteAllWarning] = useState(false);
    const [showUnreadWarning, setShowUnreadWarning] = useState(false);
    const [showReadWarning, setShowReadWarning] = useState(false);

    const [showZipExportWarning, setShowZipExportWarning] = useState(false)


    const [dataForDownload, setDataForDownload] = useState(null);

    const [exporting, setExporting] = useState(false);

    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState(null);

    const [status, setStatus] = useState(null);

    const [error, setError] = useState(null);

    const [handler, setHandler] = useState(null);

    const closePublishAllWarning = () => {
        setShowPublishAllWarning(false)
    }

    const openPublishAllWarning = () => {
        setShowPublishAllWarning(true)
    }

    const handlePublishAll = async () => {
        const unpublished = await form.submit(publishEndpoint, { ids: selectItemsRows });

        if (unpublished) {
            router.refresh();
            closeUnpublishAllWarning()
        }
        else {
            closeUnpublishAllWarning()
        }
    }

    const closeUnpublishAllWarning = () => {
        setShowUnpublishAllWarning(false)
    }

    const openUnPublishAllWarning = () => {
        setShowUnpublishAllWarning(true)
    }

    const handleUnpublishAll = async () => {
        const published = await form.submit(unpublishEndpoint, { ids: selectItemsRows });

        if (published) {
            router.refresh();
            closeUnpublishAllWarning()
        }
        else {
            closeUnpublishAllWarning()
        }
    }

    const closeDeleteAllWarning = () => {
        setShowDeleteAllWarning(false)
        setStatus(null)
        setHandler(null)
        setShowWarning(false)
    }

    const openDeleteAllWarning = () => {
        setShowDeleteAllWarning(true)
    }



    const handleView = () => {
        router.push(`${viewUrl}?id=${selectItemsRows[0]}&&published=${published}&&read=${read}&&cancelled=${cancelled}`)
    }

    const handleEdit = () => {
        router.push(`${editUrl}?id=${selectItemsRows[0]}`)
    }

    const handleNotify = () => {
        router.push(`${notifyUrl}?idList=${JSON.stringify(selectItemsRows)}&&relatedId=${router.query?.id}&&sender=${username}&&mass=true`)
    }

    const handleUnread = async () => {
        const unread = await form.submit(markAsUnreadEndpoint, { ids: selectItemsRows });
        if (unread) {
            setShowUnreadWarning(false);
            router.refresh()
        }
        else {
            setShowUnreadWarning(false);
        }
    };

    const handleRead = async () => {
        const read = await form.submit(markAsReadEndpoint, { ids: selectItemsRows });
        if (read) {
            setShowReadWarning(false);
            router.refresh()
        }
        else {
            setShowReadWarning(false);
        }
    }

    const handleReply = () => {
        router.push(`${replyUrl}?id=${selectItemsRows[0]}`)
    }

    const closeModal = () => {
        setShowDraftWarning(false);
    }

    const handleOpenWarning = ({ message, degree, title, status, handler }) => {
        setWarningMessage({ message, title });
        setShowWarning(true);
        setStatus(status)
        setHandler(handler)
    }

    const handleCloseWarning = () => {
        setShowWarning(false);
        setStatus(null);
        setHandler(null)
        setTimeout(() => {
            setWarningMessage(null);
        }, 300)
    }

    const handleEligibility = async () => {
        const data = await form.submit(`/api/cms/funds/internal-funds/application/eligibility?status=${status}`,
            { ids: selectItemsRows });

        if (data) {
            router.refresh();
            handleCloseWarning()
        }
    }

    const handleVotingEligility = async () => {
        const data = await form.submit(`/api/cms/funds/internal-funds/application/move-to-voting`,
            { ids: selectItemsRows });

        if (data) {
            router.refresh();
            handleCloseWarning()
        }
    }

    const handleRemoveFromVoting = async () => {
        const data = await form.submit(`/api/cms/funds/internal-funds/vote/move-from-voting`,
            { ids: selectItemsRows });

        if (data) {
            router.refresh();
            handleCloseWarning()
        }
    }


    const handleInitiateDelete = () => {
        handleOpenWarning({
            message: `You are about to delete the selected ${title}`,
            title: `Delete${selectItemsRows?.length > 1 ? ' all' : ''} the selected ${title}`, status: '', handler: 'delete'
        })
    }

    const handleInitiatePublish = () => {
        handleOpenWarning({
            message: `You are about to publish the selected ${title}, which means they will be visible for everyone to see on the website.`,
            title: `Publish${selectItemsRows?.length > 1 ? ' all' : ''} the selected ${title}`, status: '', handler: 'publish'
        })
    }

    const handleInitiateUnpublish = () => {
        handleOpenWarning({
            message: `You are about to unpublish all the ${title}, which means it will no longer be visible on the website`,
            title: `Unpublish${selectItemsRows?.length > 1 ? ' all' : ''} the selected ${title}`, status: '', handler: 'unpublish'
        })
    }

    const handleInitiateMarkAsRead = () => {
        handleOpenWarning({
            message: `You are about to mark this enquiry as read`,
            title: `Mark${selectItemsRows?.length > 1 ? ' all' : ''} as read`, status: '', handler: 'markAsRead'
        })
    }

    const handleInitiateMarkAsUnread = () => {
        handleOpenWarning({
            message: `You are about to mark this enquiry as unread`,
            title: `Mark${selectItemsRows?.length > 1 ? ' all' : ''} as unread`, status: '', handler: 'markAsUnread'
        })
    }


    const handleInitiateCancel = () => {
        handleOpenWarning({
            message: `You are about to cancel the selected ${title}, which means all events will no longer hold`,
            title: `Cancel${selectItemsRows?.length > 1 ? ' all' : ''} the selected ${title}`, status: '', handler: 'cancel'
        })
    }

    const handleInitiateSetAsDefaultEmail = () => {
        handleOpenWarning({
            message: `This email address will be made the default email address for sending replies to enquiries`,
            title: `Set as default email`, status: '', handler: 'defaultEmail'
        })
    }

    const handleDeleteAll = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${deleteEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('deleted ');
                    closeDeleteAllWarning();
                    window.location.reload()
                }
                else if (body?.error) {
                    closeDeleteAllWarning();
                    setError(body?.error)
                }
                else {
                    console.log('error deleting ');
                    closeDeleteAllWarning();
                }
            },
            errorCallback: () => {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        })
    }


    const handlePublish = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${publishEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('deleted ');
                    closeDeleteAllWarning();
                    window.location.reload()
                }
                else {
                    console.log('error deleting ');
                    closeDeleteAllWarning();
                }
            },
            errorCallback: () => {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        })
    }

    const handleSetDefaultEmail = async (ev) => {
        setStatus('submitting')
        try {
            const response = await fetch(`/api/set-default-contact-form-email?id=${selectItemsRows[0]}`, { method: 'GET' });
            const { result, loginRedirect } = await response.json();

            loginRedirect && window.location.replace('/login')

            if (result) {
                closeDeleteAllWarning();
                window.location.reload()
            }
        } catch (error) {
            console.log('error deleting ');
            closeDeleteAllWarning();
        }
    }



    const handleUnpublish = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${unpublishEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('deleted ');
                    closeDeleteAllWarning();
                    window.location.reload()
                }
                else {
                    console.log('error deleting ');
                    closeDeleteAllWarning();
                }
            },
            errorCallback: () => {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        })
    }

    const handleCancel = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${cancelEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('deleted ');
                    closeDeleteAllWarning();
                    window.location.reload()
                }
                else {
                    console.log('error deleting ');
                    closeDeleteAllWarning();
                }
            },
            errorCallback: () => {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        })
    }

    const handleMarkAsRead = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${markAsReadEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('deleted ');
                    closeDeleteAllWarning();
                    window.location.reload()
                }
                else {
                    console.log('error deleting ');
                    closeDeleteAllWarning();
                }
            },
            errorCallback: () => {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        })
    }

    const handleMarkAsUnead = async () => {
        setStatus('submitting')
        await postRequestHandler2({
            route: `${markAsUnreadEndpoint}`, body: { id: JSON.stringify(selectItemsRows) },
            successCallback: body => {
                const result = body?.result;

                if (result) {
                    console.log('deleted ');
                    closeDeleteAllWarning();
                    window.location.reload()
                }
                else {
                    console.log('error deleting ');
                    closeDeleteAllWarning();
                }
            },
            errorCallback: () => {
                console.log('error deleting ');
                closeDeleteAllWarning();
            }
        })
    }

    const opHandlers = {
        eligibility: handleEligibility,
        moveToVoting: handleVotingEligility,
        moveFromVoting: handleRemoveFromVoting,
        delete: handleDeleteAll,
        publish: handlePublish,
        unpublish: handleUnpublish,
        cancel: handleCancel,
        markAsRead: handleMarkAsRead,
        markAsUnread: handleMarkAsUnead,
        defaultEmail: handleSetDefaultEmail
    }

    const multipleSelection = selectItemsRows?.length > 1

    console.log('includes concluded/justconcluded', { includesConcluded, includesJustConcluded })

    return <div style={{
        position: 'absolute', bottom: '150px', transform: 'translate(-50%,-50%)', justifyContent: 'space-between',
        background: '#F2F7FF', width: 'max-content', left: '50%', right: '50%', display: 'flex', alignItems: 'center',
        border: '2px solid #64A5F1', borderRadius: '16px', padding: '12px 12px',
        boxShadow: '16px 16px 24px 0px #1C1D221F, -16px -16px 24px 0px #1C1D221A'
    }}>
        <CloseIcon
            onClick={handleCancelSelection} sx={{
                fontSize: 23, color: 'primary.main',
                cursor: 'pointer', marginRight: '8px'
            }}
        />

        <Typography style={{
            fontSize: '13px', fontWeight: 700, margin: '0 8px'
        }}>
            {selectItemsRows?.length} {multipleSelection ? 'items' : 'item'} selected
        </Typography>

        {floatingActions?.includes('publish') && ((!includesJustConcluded && !includesConcluded && !published && !multipleSelection) || (multipleSelection && !includesJustConcluded && !includesConcluded)) &&
            <IconButton label={multipleSelection ? 'Publish All' : 'Publish'} handleClick={handleInitiatePublish} />}

        {floatingActions?.includes('unpublish') && (((!includesJustConcluded && !includesConcluded && published || cancelled) && !multipleSelection) || (multipleSelection && !includesJustConcluded && !includesConcluded)) &&
            <IconButton label={multipleSelection ? 'Unpublish All' : 'Unpublish'} handleClick={handleInitiateUnpublish} />}

        {floatingActions?.includes('defaultEmail') && !defaultEmail && !multipleSelection &&
            <IconButton label={'Set as default email'} handleClick={handleInitiateSetAsDefaultEmail} />}

        {floatingActions?.includes('cancel') && ((!includesJustConcluded && !includesConcluded && !cancelled && !multipleSelection) || (multipleSelection && !includesJustConcluded && !includesConcluded)) &&
            <IconButton label={multipleSelection ? 'Cancel All' : 'Cancel'} handleClick={handleInitiateCancel} />}

        {floatingActions?.includes('view') && !multipleSelection &&
            <IconButton label={'View'} handleClick={handleView} />}

        {floatingActions?.includes('edit') && !includesJustConcluded && !includesConcluded && !multipleSelection &&
            <IconButton label={'Edit'} handleClick={handleEdit} />}

        {floatingActions?.includes('markAsRead') && !replied && ((!read && !multipleSelection) || (multipleSelection)) &&
            <IconButton label={multipleSelection ? 'Mark As All Read' : 'Mark As Read'}
                handleClick={handleInitiateMarkAsRead}
            />}

        {floatingActions?.includes('markAsUnread') && !replied && ((read && !multipleSelection) || (multipleSelection)) &&
            <IconButton label={multipleSelection ? 'Mark All As Unread' : 'Mark As Unread'}
                handleClick={handleInitiateMarkAsUnread}
            />}

        {floatingActions?.includes('delete') && (multipleSelection ? floatingActions?.includes('deleteAll') ? true : false : true) &&
            <IconButton label={`Delete ${(multipleSelection) ? 'all' : ''}`} iconRight={<Delete sx={{ fontSize: 13, ml: 1 }} />}
                background='#FF00001A' handleClick={handleInitiateDelete} />}


        {/*  {floatingActions?.includes('exportPdf') &&
            <IconButton label={'Export'} iconRight={'pdf'} iconRightProps={{
                height: '12', width: '12', style: { marginLeft: '4px' }
            }} onClick={exportToPdf} />
        } */}
        {/* 
        {floatingActions?.includes('exportExcel') &&
            <IconButton label={'Export'} iconRight={'excel'} marginLeft={'8px'} marginRight={'8px'} iconRightProps={{
                height: '14', width: '14', style: { marginLeft: '4px' }
            }} onClick={exportToExcel} />
        } */}

        {/*   {floatingActions?.includes('eligible') && (eligible === false || eligible === 'none') && selectItemsRows?.length == 1 &&
            <IconButton label={'Change to Eligible'} marginLeft={'4px'} color='#008000' marginRight={'4px'} onClick={handleToEligible}
            />} */}

        {/*   {floatingActions?.includes('ineligible') && (eligible == true || eligible === 'none') && selectItemsRows?.length == 1 &&
            <IconButton label={'Change to Ineligible'} marginLeft={'4px'} color='#6F3D17' marginRight={'4px'} onClick={handleToIneligible}
            />} */}
        {/* 
        {floatingActions?.includes('eligible') && selectItemsRows?.length > 1 &&
            <IconButton label={'Change all to Eligible'} marginLeft={'4px'} color='#008000' marginRight={'4px'} onClick={handleToEligible}
            />} */}

        {/*  {floatingActions?.includes('ineligible') && selectItemsRows?.length > 1 &&
            <IconButton label={'Change all to Ineligible'} marginLeft={'4px'} color='#6F3D17' marginRight={'4px'} onClick={handleToIneligible}
            />} */}

        {/*  {floatingActions?.includes('moveToVoting') && !votingEligible && (selectItemsRows?.length === 1) &&
            <IconButton label={'Move To Voting'} marginLeft={'4px'} marginRight={'4px'} onClick={handleMoveToVoting}
            />} */}
        {/* 
        {floatingActions?.includes('moveToVoting') && (selectItemsRows?.length > 1) &&
            <IconButton label={'Move all To Voting'} marginLeft={'4px'} marginRight={'4px'} onClick={handleMoveToVoting}
            />} */}
        {/* 
        {floatingActions?.includes('moveFromVoting') && (selectItemsRows?.length === 1) &&
            <IconButton label={'Remove From Voting'} marginLeft={'4px'} marginRight={'4px'} onClick={handleMoveFromVoting}
            />} */}

        {/*  {floatingActions?.includes('moveFromVoting') && (selectItemsRows?.length > 1) &&
            <IconButton label={'Remove all From Voting'} marginLeft={'4px'} marginRight={'4px'} onClick={handleMoveFromVoting}
            />} */}


        {/*  {floatingActions?.includes('notify') && (selectItemsRows?.length > 1 ? floatingActions?.includes('notifyAll') ? true : false : true) &&
            <IconButton label={`Notify ${(selectItemsRows?.length > 1) ? 'all' : ''}`} iconRight={'notify'}
                marginLeft={'4px'} marginRight={'4px'} iconRightProps={{
                    height: '12', width: '12', style: { marginLeft: '4px' }
                }} onClick={handleNotify}
            />} */}

        {/*  {floatingActions?.includes('downloadApplication') &&
            <IconButton label={`Download ${(selectItemsRows?.length > 1) ? 'all Applications' : 'Application'}`}
                iconRight={'excel'} iconLeft={'download'} iconLeftProps={{ height: '12', width: '12', style: { marginRight: '4px' } }}
                marginLeft={'4px'} marginRight={'4px'} iconRightProps={{
                    height: '14', width: '14', style: { marginLeft: '4px' }
                }} onClick={handleDownloadApplication}
            />} */}

        {/*  {(selectItemsRows?.length > 1 && floatingActions?.includes('publishAll')) &&
            <IconButton label={'Publish All'} marginLeft={'4px'} color={'#008000'} marginRight={'4px'} onClick={openPublishAllWarning}
            />} */}
        {/* 
        {floatingActions?.includes('publish') && !published && (selectItemsRows?.length === 1) &&
            <IconButton label={'Publish'} marginLeft={'4px'} color={'#008000'} marginRight={'4px'} onClick={openPublishAllWarning}
            />} */}

        {/*  {floatingActions?.includes('unread') && read && (selectItemsRows?.length === 1) &&
            <IconButton label={'Mark as unread'} marginLeft={'4px'} color={'#FF6B00'} marginRight={'4px'}
                onClick={() => { setShowUnreadWarning(true) }} />} */}

        {/*  {(selectItemsRows?.length > 1 && floatingActions?.includes('unreadAll')) &&
            <IconButton label={'Mark all as unread'} marginLeft={'4px'} color={'#FF6B00'} marginRight={'4px'}
                onClick={() => { setShowUnreadWarning(true) }} />} */}

        {/*   {floatingActions?.includes('read') && !read && !replied && (selectItemsRows?.length === 1) &&
            <IconButton label={'Mark as read'} marginLeft={'4px'} color={'#008000'} marginRight={'4px'}
                onClick={() => { setShowReadWarning(true) }} />} */}

        {/*  {(selectItemsRows?.length > 1 && !replied && floatingActions?.includes('readAll')) &&
            <IconButton label={'Mark all as read'} marginLeft={'4px'} color={'#008000'} marginRight={'4px'}
                onClick={() => { setShowReadWarning(true) }} />} */}

        {/*  {floatingActions?.includes('reply') && !replied && (selectItemsRows?.length === 1) &&
            <IconButton label={'Reply'} iconRight={'reply'} marginLeft={'4px'} marginRight={'4px'} iconRightProps={{
                height: '12', width: '12', style: { marginLeft: '8px' }
            }} onClick={handleReply} />} */}

        {/*   {floatingActions?.includes('view') && selectItemsRows?.length === 1 &&
            <IconButton label={'View'} iconRight={'view'} marginLeft={'4px'} marginRight={'4px'} iconRightProps={{
                height: '14', width: '14', style: { marginLeft: '4px' }
            }} onClick={handleView} />} */}

        {/*   {floatingActions?.includes('edit') && selectItemsRows?.length === 1 &&
            <IconButton label={'Edit'} iconRight={'edit'} marginLeft={'4px'} marginRight={'4px'} iconRightProps={{
                height: '12', width: '12', style: { marginLeft: '4px' }
            }} onClick={handleEdit} />} */}

        {/*  {(selectItemsRows?.length > 1 && floatingActions?.includes('unpublishAll')) &&
            <IconButton label={'Unpublish All'} marginLeft={'4px'} color={'#FF0000'} marginRight={'4px'}
                onClick={openUnPublishAllWarning} />} */}

        {/*  {floatingActions?.includes('unpublish') && published && (selectItemsRows?.length === 1) &&
            <IconButton label={'Unpublish'} marginLeft={'4px'} color={'#FF0000'} marginRight={'4px'}
                onClick={openUnPublishAllWarning} />} */}

        {/*   {floatingActions?.includes('zipExport') &&
            <IconButton label={'Export as Zip file'} iconRight={'zip'} marginLeft={'4px'} marginRight={'4px'}
                iconRightProps={{ height: '12', width: '12', style: { marginLeft: '4px' } }} onClick={handleOpenZipExport} />} */}

        {/*   {floatingActions?.includes('delete') && (selectItemsRows?.length > 1 ? floatingActions?.includes('deleteAll') ? true : false : true) &&
            <IconButton label={`Delete ${(selectItemsRows?.length > 1) ? 'all' : ''}`} iconRight={'delete'} marginLeft={'4px'} marginRight={'4px'}
                background='#FF00001A' iconRightProps={{ height: '12', width: '12', style: { marginLeft: '4px' } }} onClick={openDeleteAllWarning} />} */}

        {/*  <Modal visibility={showPublishAllWarning} handleClose={closePublishAllWarning}>
            <WarningModal
                title={`publish${selectItemsRows?.length > 1 ? ' all' : ''} selected ${title}`}
                status={form.status}
                message={`${selectItemsRows?.length > 1 ? 'All the' : 'The'} selected ${title} with the status of unpublished and saved will published on the EA website.`}
                proceedAction={async () => { await handlePublishAll() }}
                cancelAction={closePublishAllWarning} />
        </Modal> */}

        {/*  <Modal visibility={showUnpublishAllWarning} handleClose={closeUnpublishAllWarning}>
            <WarningModal
                title={`unpublish${selectItemsRows?.length > 1 ? ' all' : ''} selected ${title}`}
                status={form.status}
                message={`${selectItemsRows?.length > 1 ? 'All the' : 'The'} the selected ${title} with the status of published will unpublished on the EA website.`}
                proceedAction={async () => { await handleUnpublishAll() }}
                cancelAction={closeUnpublishAllWarning} />
        </Modal> */}

        {/*  <Modal visibility={showDeleteAllWarning} handleClose={closeDeleteAllWarning}>
            <WarningModal
                title={`deleting all selected ${title}`} status={form.status}
                message={`Are you sure you want to delete all the selected ${title}?`}
                proceedAction={async () => { await handleDeleteAll() }}
                cancelAction={closeDeleteAllWarning} />
        </Modal> */}

        {/*  <Modal visibility={showDraftWarning} handleClose={closeModal}>
            <WarningModal
                title={`Edit fund`} status={form.status}
                message={`To edit this published fund, you must create a draft copy that won' affect the original copy of the E A Website`}
                proceedAction={async () => { await createDraft() }} cancelAction={closeModal}
            />
        </Modal> */}

        {/*   <Modal visibility={showWarning} handleClose={handleCloseWarning}>
            <WarningModal
                title={warningMessage?.title} status={form.status}
                message={warningMessage?.message}
                proceedAction={async () => { await opHandlers[handler]() }} cancelAction={handleCloseWarning}
            />
        </Modal> */}

        {/*   <Modal visibility={showReadWarning} handleClose={() => { setShowReadWarning(false) }}>
            <WarningModal
                title={`mark as${selectItemsRows?.length > 1 ? ' all' : ''} read`}
                status={form.status}
                message={`${selectItemsRows?.length > 1 ? 'These enquiries' : 'This enquiry'} status will be changed from unread to read.`}
                proceedAction={async () => { await handleRead() }} cancelAction={() => { setShowReadWarning(false) }}
            />
        </Modal> */}

        {/*  <Modal visibility={showUnreadWarning} handleClose={() => { setShowUnreadWarning(false) }}>
            <WarningModal
                title={`mark as${selectItemsRows?.length > 1 ? ' all' : ''} unread`}
                status={form.status}
                message={`${selectItemsRows?.length > 1 ? 'These enquiries' : 'This enquiry'} status will be changed from read to unread.`}
                proceedAction={async () => { await handleUnread() }} cancelAction={() => { setShowUnreadWarning(false) }}
            />
        </Modal> */}

        {/*  {showZipExportWarning && <ZipExportPrompt
            columnArray={zipExportColumnArray}
            title={zipExportTitle}
            format={zipExportFormat}
            idList={selectItemsRows}
            handleClose={handleCloseZipExport}
            exportEndpoint={zipExportEndpoint}
            sections={zipExportSections}
        />} */}

        {showWarning && <WarningModal
            title={warningMessage?.title} open={showWarning}
            message={warningMessage?.message} status={status}
            proceedAction={async () => { await opHandlers[handler]() }} handleCancel={handleCloseWarning} />}


        {error && <ModalMessage
            open={error}
            handleCancel={() => { setError(null) }}
            message={error}
        />}
    </div>
}