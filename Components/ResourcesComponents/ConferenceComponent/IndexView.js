import Banner from "@/Components/Banner";
import EditButton from "@/Components/EditButton/EditButton";
import WarningModal from "@/Components/WarningModal/WarningModal";
import { getRequestHandler } from "@/Components/requestHandler";
import { ChildrenSvgDyn, CirclePlusSvg, MenSvgDyn, NoteSvgDyn, WomenSvgDyn, YouthSvgDyn } from "@/public/icons/icons";
import generateFileUrl from "@/utils/getImageUrl";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddSectionView from "./AddSectionView";
import AddCategoryView from "./AddCategoryView";
import OptionsMenu from "@/Components/OptionsMenu/OptionsMenu";
import Loader from "@/Components/Loader/Loader";

export default function IndexView({ editUrl, preview, previewPayload, handleOpenCreateForm, handleCloseCreateForm, setCount, showAddNewForm }) {
    const [data, setData] = useState(null)

    const [noData, setNoData] = useState(false);

    const [openItemForm, setOpenItemForm] = useState(null);
    const [sectionName, setSectionName] = useState(null);
    const [openSectionEdit, setOpenSectionEdit] = useState(null);
    const [showDeleteWarning, setShowDeleteWarning] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showItemDeleteWarning, setShowItemDeleteWarning] = useState(null);
    const [itemName, setItemName] = useState(null);

    const router = useRouter()

    const sampleData = [
        { sectionId: 1, sectionTitle: "Men's Conference", name: "men conference - 1" },
        { sectionId: 2, sectionTitle: "Women's Conference", name: "women conference - 1" },
        { sectionId: 3, sectionTitle: "Men Conference", name: null },
    ]

    const processData = (data) => {
        const sections = [];
        const processedKeys = [];
        data?.forEach(i => {
            if (!processedKeys?.includes(i?.sectionId)) {
                const sectionId = i?.sectionId;
                const list = data?.filter(it => it?.sectionId === sectionId)?.filter(i => i?.name)?.map(i => i?.name)
                sections.push({ sectionId, sectionTitle: i?.sectionTitle, sectionItems: list })
                processedKeys.push(sectionId)
            }
        });

        return sections
    }

    useEffect(() => {

        /*   const sections = processData(sampleData)
          setData(sections)
          setCount(sections?.map(i => i?.sectionItems)?.flat(1)?.length) */
        //Get and set the data
        if (preview) {
            console.log('required data', previewPayload);
            setData(previewPayload);
        }
        else {
            //Get content
           /*  false && */ getRequestHandler({
            route: `/api/conference`,
            successCallback: body => {
                const result = body?.result;
                if (result) {
                    const sections = processData(result)
                    setData(sections)
                    console.log('sections for loading', { sections })
                    setCount(sections?.map(i => i?.sectionItems)?.flat(1)?.length)

                    setNoData(false)
                }
                else {
                    setData([])
                    // setNoData(true)
                }
            },
            errorCallback: err => {
                setNoData(true);
                setData([])
                console.log('Something went wrong')
            }
        })
        }
    }, [])

    const handleEdit = () => {
        router.push(editUrl)
    }

    const handleCloseItemForm = () => {
        setOpenItemForm(false);
        setSectionName(null)
    }

    const handleOpenItemForm = (id, sectionName, item) => {
        setOpenItemForm(id);
        setSectionName(sectionName)
        item && setItemName(item)
    }

    const handleDelete = async () => {
        setDeleting(true);
        const response = await fetch(`/api/delete-conference?id=${showDeleteWarning}`, { method: 'GET' });
        const { result, loginRedirect } = await response.json();

        loginRedirect && window.location.replace('/login')
        if (result) {
            setDeleting(false);
            setShowDeleteWarning(null);
            window.location.reload();
        }
    }

    const handleDeleteItem = async () => {
        setDeleting(true);
        const response = await fetch(`/api/delete-conference-category?id=${showItemDeleteWarning?.id}&&name=${showItemDeleteWarning?.name}`, { method: 'GET' });
        const { result, loginRedirect } = await response.json();

        loginRedirect && window.location.replace('/login')
        if (result) {
            setDeleting(false);
            setShowItemDeleteWarning(null)
            window.location.reload();
        }
    }

    const handleOpenItemDeleteWarning = (id, name) => {
        setShowItemDeleteWarning({ id, name })
    }

    const handleCloseItemDeleteWarning = () => {
        setShowItemDeleteWarning(null)
        setDeleting(false)
    }

    const handleOpenDeleteWarning = (id) => {
        setShowDeleteWarning(id)
    }

    const handleOpenSectionEditForm = (id, sectionName) => {
        handleOpenCreateForm(true)
        setOpenSectionEdit(id)
        setSectionName(sectionName)
    }

    const closeDeleteWarning = () => {
        setShowDeleteWarning(null);
        setDeleting(false)
    }

    return (data ?
        <Box sx={{
            display: 'flex', alignItems: { xs: 'center', lg: 'flex-start' },
            flexDirection: { xs: 'column-reverse', lg: 'row' }, flexWrap: 'wrap',
            py: { xs: 1, md: 2, lg: 3 }, justifyContent: 'flex-start',
        }}>
            {data?.map((item, index) => {
                return <Box key={index} sx={{
                    border: '0.83px solid #1414171A', boxShadow: '0px 15.999987602233887px 31.999975204467773px 0px #0000000F',
                    borderRadius: '12px', flexDirection: 'column',
                    width: { xs: '95%', lg: '30vw' }, mx: 'auto', display: 'flex', alignItems: 'center', mt: 2
                }}>
                    {/* Section title */}
                    <Box sx={{ position: 'relative', width: '100%', }}>
                        <Typography sx={{
                            width: '100%', color: 'primary.main', py: 1, fontSize: 14, fontWeight: 600,
                            textAlign: 'center'
                        }}>
                            {item?.sectionTitle}
                        </Typography>

                        <OptionsMenu id={item?.sectionId} handleDelete={() => { handleOpenDeleteWarning(item?.sectionId) }}
                            handleEdit={() => {
                                handleOpenSectionEditForm(item?.sectionId, item?.sectionTitle)
                            }}
                        />
                    </Box>

                    {/* Add section button */}
                    <Button variant="outlined" sx={{
                        fontSize: 14, fontWeight: 600, border: 'none', display: 'flex', justifyContent: 'flex-start',
                        width: '100%', borderBottom: '1px solid #14141721'
                    }} onClick={() => { handleOpenItemForm(item?.sectionId, item?.sectionTitle) }}>
                        <CirclePlusSvg style={{ marginRight: '12px', height: '16px', width: '16px' }} />  Add New Category
                    </Button>

                    {/* List of characters */}
                    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {item?.sectionItems?.map((child, indx) => {
                            return <Box sx={{ position: 'relative', width: '100%' }}>
                                <Typography key={{ indx }} sx={{
                                    px: 2, py: 1,
                                    fontSize: 13, width: '100%', borderBottom: '1px solid #14141721'
                                }}>
                                    {child}
                                </Typography>
                                <OptionsMenu id={item?.sectionId}
                                    handleDelete={() => {
                                        handleOpenItemDeleteWarning(item?.sectionId, child)
                                    }}
                                    handleEdit={() => {
                                        handleOpenItemForm(item?.sectionId, item?.sectionTitle, child)
                                    }}
                                />
                            </Box>
                        })}
                    </Box>
                </Box>
            })}

            {openItemForm && <WarningModal open={openItemForm} showAction={false}
                handleCancel={handleCloseItemForm} title={`Add New Category on ${sectionName}`} type="success"
                message={<AddCategoryView closeForm={handleCloseItemForm} sectionId={openItemForm}
                    submitEndpoint={`/api/add-conference-category`} sectionName={sectionName}
                    pageName={'bibleCharacter'} itemName={itemName} />}
            />}

            {showAddNewForm && <WarningModal open={showAddNewForm} showAction={false}
                handleCancel={handleCloseCreateForm} title='Add New Conference' type="success"
                message={<AddSectionView closeForm={handleCloseCreateForm} id={openSectionEdit}
                    submitEndpoint={'/api/add-conference'} sectionName={sectionName}
                    pageName={'bibleCharacter'} />}
            />}

            {showDeleteWarning && <WarningModal open={showDeleteWarning}
                handleCancel={closeDeleteWarning} title='Delete Conference' type="success"
                message={`You are about to delete this conference`} proceedAction={handleDelete}
                status={deleting ? 'submitting' : 'default'}
            />}

            {showItemDeleteWarning && <WarningModal open={showItemDeleteWarning}
                handleCancel={handleCloseItemDeleteWarning} title='Delete Conference Category' type="success"
                message={`You are about to delete this conference category`} proceedAction={handleDeleteItem}
                status={deleting ? 'submitting' : 'default'}
            />}

        </Box>
        : <Box sx={{ display: 'flex', alignItems: 'center', py: 6, justifyContent: 'center', width: '100%' }}>
            <Loader />
        </Box>)
}