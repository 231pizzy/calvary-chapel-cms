
import WarningModal from "@/Components/WarningModal/WarningModal";
import { getRequestHandler } from "@/Components/requestHandler";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddMinistryView from "./AddMinistryView";
import OptionsMenu from "@/Components/OptionsMenu/OptionsMenu";
import Loader from "@/Components/Loader/Loader";

export default function IndexView({ editUrl, preview, previewPayload, handleOpenCreateForm, handleCloseCreateForm, setCount, showAddNewForm }) {
    const [data, setData] = useState(null)

    const [noData, setNoData] = useState(false);

    const [openItemForm, setOpenItemForm] = useState(null);
    const [sectionName, setSectionName] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showItemDeleteWarning, setShowItemDeleteWarning] = useState(null);
    const [itemName, setItemName] = useState(null);

    const router = useRouter()

    const sampleData = [
        { sectionTitle: 'Left Section', },
        { sectionTitle: 'Right Section', },
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
        /*  setData(sampleData)
         setCount(sampleData?.length); */
        /* const sections=processData(sampleData)
                setData(sections)
                setCount(sections?.map(i => i?.sectionItems)?.flat(1)?.length) */
        //Get and set the data
        if (preview) {
            console.log('required data', previewPayload);
            setData(previewPayload);
        }
        else {
            //Get content
            getRequestHandler({
                route: `/api/resource-ministry`,
                successCallback: body => {
                    const result = body?.result;
                    if (result) {
                        setData(result)
                        setCount(result?.length);
                        setNoData(false)
                    }
                    else {
                        setData(sampleData)
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


    const handleOpenItemDeleteWarning = (id, name) => {
        setShowItemDeleteWarning({ id, name })
    }

    const handleCloseItemDeleteWarning = () => {
        setShowItemDeleteWarning(null)
        setDeleting(false)
    }

    const handleOpenItemForm = (id, name) => {
        setOpenItemForm(id);
        name && setItemName(name)
        handleOpenCreateForm()
    }

    const handleDeleteItem = async () => {
        setDeleting(true);
        const response = await fetch(`/api/delete-resource-ministry?id=${showItemDeleteWarning?.id}`, { method: 'GET' });
        const { result, loginRedirect } = await response.json();

        loginRedirect && window.location.replace('/login')

        if (result) {
            setDeleting(false);
            setShowItemDeleteWarning(null)
            window.location.reload();
        }
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
                    borderRadius: '12px', flexDirection: 'column', position: 'relative',
                    width: { xs: '95%', lg: '30vw' }, mx: 'auto', display: 'flex', alignItems: 'center', mt: 2
                }}>
                    {/* Section title */}
                    <Typography sx={{
                        color: 'primary.main', py: 1, fontSize: 14, fontWeight: 600,
                        textAlign: 'center'
                    }}>
                        {item?.sectionTitle}
                    </Typography>
                    <OptionsMenu id={item?._id}
                        handleDelete={() => {
                            handleOpenItemDeleteWarning(item?._id, item?.sectionTitle)
                        }}
                        handleEdit={() => {
                            handleOpenItemForm(item?._id, item?.sectionTitle)
                        }}
                    />
                </Box>
            })}

            {showAddNewForm && <WarningModal open={showAddNewForm} showAction={false}
                handleCancel={handleCloseCreateForm} title='Add New Ministry' type="success"
                message={<AddMinistryView closeForm={handleCloseCreateForm} name={itemName}
                    submitEndpoint={'/api/add-resource-ministry'} id={openItemForm}
                    pageName={'resourceMinistry'} />}
            />}

            {showItemDeleteWarning && <WarningModal open={showItemDeleteWarning}
                handleCancel={handleCloseItemDeleteWarning} title='Delete Ministry' type="success"
                message={`You are about to delete this ministry`} proceedAction={handleDeleteItem}
                status={deleting ? 'submitting' : 'default'}
            />}

        </Box>
        : <Box sx={{ display: 'flex', alignItems: 'center', py: 6, justifyContent: 'center', width: '100%' }}>
            <Loader />
        </Box>)
}