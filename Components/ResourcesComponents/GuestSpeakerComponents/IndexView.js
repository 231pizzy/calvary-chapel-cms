
import { getRequestHandler } from "@/Components/requestHandler";
import { CirclePlusSvg, DeleteSvg, EditPenSvg, MoreSvg } from "@/public/icons/icons";
import generateFileUrl from "@/utils/getImageUrl";
import { Avatar, Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddView from "./AddView";
import WarningModal from "@/Components/WarningModal/WarningModal";
import EditView from "./EditView";
import OptionsMenu from "@/Components/OptionsMenu/OptionsMenu";
import Loader from "@/Components/Loader/Loader";

export default function IndexView({ editUrl, preview, /* handleCloseCreateForm, */ previewPayload, setCount, /* showAddNewForm */ }) {
    const [data, setData] = useState(null)

    const [noData, setNoData] = useState(false);

    const [detailData, setDetailData] = useState({});


    const [showDeleteWarning, setShowDeleteWarning] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAddNewForm, setShowAddNewForm] = useState(false);

    const [deleting, setDeleting] = useState(false)

    const [showOptions, setShowOptions] = useState(null)

    const router = useRouter()

    const sampleData = [
        { id: 1, name: 'Robert Pecoraro', image: '/images/robert-resource.png', },
        { id: 2, name: 'Phillip Gouse', image: '', },
        { id: 3, name: 'Tatiana Rosser', image: '/images/tatiana-resource.png', },
        { id: 4, name: 'Lincoln Ekstrom ', image: '/images/ekstrom-resource.png', },
        { id: 5, name: 'Marilyn Geidt', image: '/images/marilyn-resource.png', },
        { id: 6, name: 'Ryan Korsgaard', image: '', },
    ]

    useEffect(() => {
        //Get and set the data
        if (preview) {
            console.log('required data', previewPayload);
        }
        else {
            //Get content
            getRequestHandler({
                route: `/api/guest-speakers`,
                successCallback: body => {
                    const result = body?.result;
                    if (result?.length) {
                        setData(body?.result?.map(i => {
                            return {
                                ...i,
                                image: generateFileUrl(i?.image)
                            }
                        }))
                        setCount(body?.result?.length)
                        setNoData(false)
                    }
                    else {
                        setData([])
                        setCount(0)
                        // setNoData(true)
                    }
                },
                errorCallback: err => {
                    setNoData(true);
                    setData([])
                    setCount(0)
                    console.log('Something went wrong')
                }
            })
        }
    }, [])

    console.log('data in guest speakers', { data })

    const closeDeleteWarning = () => {
        setShowDeleteWarning(null);
    }

    const closeEditForm = () => {
        setShowEditForm(null)
    }

    const handleCloseCreateForm = () => {
        setShowAddNewForm(false)
    }

    const openDeleteWarning = (id) => {
        setShowDeleteWarning(id)
    }

    const openCreateForm = () => {
        setShowAddNewForm(true)
    }

    const closeCreateForm = () => {
        handleCloseCreateForm()
    }

    const openOptions = (id) => {
        setShowOptions(id)
    }

    const closeOptions = () => {
        setShowOptions(null)
    }

    const handleDelete = async () => {
        setDeleting(true);
        const response = await fetch(`/api/delete-guest-speaker?id=${showDeleteWarning}`, { method: 'GET' });
        const { result, loginRedirect } = await response.json();

        loginRedirect && window.location.replace('/login')
        if (result) {
            setDeleting(false);
            setShowDeleteWarning(null);
            window.location.reload();
        }
    }


    return (data ?
        <Box sx={{
            display: 'flex', alignItems: { xs: 'center', lg: 'flex-start' },
            flexDirection: { xs: 'column-reverse', lg: 'row' }, overflow: preview ? 'auto' : 'inherit',
            maxHeight: preview ? 'calc(100vh - 100px)' : 'inherit',
            py: { xs: 1, md: 2, lg: 3 }, justifyContent: 'center',
        }}>
            {/* View */}
            <Box sx={{
                overflow:/*  preview ? 'auto' :  */'hidden',
                width: preview ? '98%' : { xs: '95%', lg: '90%' }, mx: 'auto',
            }}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap', px: 1, py: 0 }}>
                    {data.map((item, index) => {
                        return <Box key={index} id={item.name} sx={{
                            px: 2, py: 1, mx: 2, my: 1, border: '1px solid #1414171A',
                            borderRadius: '12px', backgroundColor: 'inherit',
                            boxShadow: '0px 8px 16px 0px #0000000F', position: 'relative',
                            dsplay: 'flex', textAlign: 'center', maxWidth: 'max-content', color: 'text.secondary',
                        }} /* onClick={() => { handleClick(item.name) }} */>
                            {/* <ProfileAvatar diameter={50} src={item?.image} /> */}
                            <OptionsMenu id={item?.id} handleDelete={openDeleteWarning} handleEdit={setShowEditForm} />

                            <Box id={item.name} sx={{ maxWidth: 'max-content', mx: 'auto' }}>

                                <Avatar
                                    id={item.name}
                                    sx={{
                                        width: { xs: '60vw', md: '50px' }, height: { xs: '60vw', md: '50px' },
                                        display: 'flex', justifyContent: 'center'
                                    }}
                                    src={item?.image || "/images/default-profile.png"}
                                />


                            </Box>
                            <Typography
                                id={item.name}
                                sx={{
                                    fontSize: { xs: 18, md: 14 }, maxWidth: '120px',
                                    fontWeight: 500, mt: { xs: 2, md: 1 }
                                }}>
                                {item.name}
                            </Typography>
                        </Box>
                    })}

                    <Button onClick={openCreateForm} sx={{
                        px: 2, py: 1, mx: 2, my: 1, border: '1px solid #1414171A',
                        borderRadius: '12px', backgroundColor: '#E6F1FF', flexDirection: 'column',
                        boxShadow: '0px 8px 16px 0px #0000000F', position: 'relative',
                        dsplay: 'flex', textAlign: 'center', width: '120px', color: 'primary.main',
                    }} /* onClick={() => { handleClick(item.name) }} */>
                        <CirclePlusSvg style={{ width: '20px', height: '20px' }} />
                        <Typography sx={{ fontSize: 13, lineHeight: '14px', mt: 1 }}>
                            Add New Speaker
                        </Typography>
                    </Button>
                </Box>
            </Box>

            {showAddNewForm && <WarningModal open={showAddNewForm} showAction={false}
                handleCancel={handleCloseCreateForm} title='Add New Speaker' type="success"
                message={<AddView closeForm={handleCloseCreateForm} submitEndpoint={'/api/update-guest-speaker?new=true'} pageName={'guestSpeaker'} />} />}

            {showEditForm && <WarningModal open={showEditForm} showAction={false}
                handleCancel={closeEditForm} title='Edit Speaker' type="success"
                message={<EditView id={showEditForm} closeForm={closeEditForm}
                    submitEndpoint={'/api/update-guest-speaker'} pageName={'guestSpeaker'} />}
            />}

            {showDeleteWarning && <WarningModal open={showDeleteWarning}
                handleCancel={closeDeleteWarning} title='Delete Guest Speaker' type="success"
                message={`You are about to delete this guest speaker`} proceedAction={handleDelete}
                status={deleting ? 'submitting' : 'default'}
            />}

        </Box >
        : <Box sx={{ display: 'flex', alignItems: 'center', py: 6, justifyContent: 'center', width: '100%' }}>
            <Loader />
        </Box>)
}