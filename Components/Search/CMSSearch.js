import { Box, Button, InputAdornment, OutlinedInput, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { icons, sidebarItems } from "../CMSLayout";
import { usePathname, useRouter } from "next/navigation";

export default function CMSSearch({ }) {
    const [searchResult, setSearchResult] = useState(null);
    const [filterSearchBy, setFilterSearchBy] = useState(null)
    const [searchString, setSearchString] = useState('');
    const pathname = usePathname()
    const router = useRouter()

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



    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearchString(value);

        if (value) {
            fetch(`/api/search?data=${encodeURIComponent(value)}`, { method: 'GET', }).then(
                async response => {
                    const { result, loginRedirect } = await response.json();
                    loginRedirect && window.location.replace('/login')

                    if (result) {
                        setSearchResult(result)
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
        pathname === endpoint
            ? (window.location.href = endpoint) : router.push(endpoint);

        setSearchResult(null)
        setSearchString('')
    }

    const filterSearchResult = (id) => {
        setFilterSearchBy(id)
    }

    console.log('search result', { searchResult });

    return <Box sx={{ position: 'relative', mr: 1 }}>
        <OutlinedInput
            placeholder="Search for anything"
            onChange={handleSearch}
            value={searchString}
            /*  endAdornment={<InputAdornment position="end" sx={{
             }}>
                 <Button variant="contained" sx={{
                     height: { xs: '40px', md: '60px' }, bgcolor: '#E6F1FF', minWidth: 'max-content',
                     fontWeight: 600, fontSize: { xs: 16, md: 20 }, borderLeft: '2px solid #0E60BF',
                 }}>
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                         style={{}}>
                         <path fillRule="evenodd" clipRule="evenodd"
                             d="M6.58821 0C2.94964 0 0 2.94964 0 6.58821C0 10.2268 2.94964 13.1764 6.58821 13.1764C8.06804 13.1764 9.43393 12.6885 10.5338 11.8648L14.3933 15.7243C14.7609 16.0919 15.3568 16.0919 15.7243 15.7243C16.0919 15.3568 16.0919 14.7609 15.7243 14.3933L11.8648 10.5338C12.6885 9.43393 13.1764 8.06804 13.1764 6.58821C13.1764 2.94964 10.2268 0 6.58821 0ZM1.88234 6.58821C1.88234 3.98923 3.98923 1.88234 6.58821 1.88234C9.18718 1.88234 11.2941 3.98923 11.2941 6.58821C11.2941 9.18718 9.18718 11.2941 6.58821 11.2941C3.98923 11.2941 1.88234 9.18718 1.88234 6.58821Z"
                             fill="#0E60BF" fillOpacity="0.3"
                         />
                     </svg>
                 </Button>
             </InputAdornment>} */

            sx={{
                height: { xs: '40px', md: '40px' }, pr: 0, width: { xs: 'auto', lg: '400px' },
                fontSize: 14, backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden'
            }}
        />

        {searchResult && <Box id="search-panel" sx={{
            position: 'absolute', top: 40, left: 0, right: 0, width: '100%', display: 'flex',
            flexDirection: 'column', zIndex: 3323232, borderTop: '1px solid grey',
            alignItems: 'flex-start', justifyContent: 'flex-start', background: 'white',
            maxHeight: 'max-content', border: '1px solid #1414171A', borderRadius: '12px'
        }}>
            <Box sx={{
                width: '100%', display: 'flex', flexDirection: 'column',
                borderBottom: '1px solid #1414171A'
            }}>
                <Typography sx={{ color: 'primary.main', fontSize: '14px', m: 1, fontWeight: 600 }}>
                    Category
                </Typography>
                <Box sx={{
                    display: 'flex', flexWrap: 'wrap', maxWidth: '100%',
                    mb: 1, alignItems: 'center'
                }}>
                    {sidebarItems.map((item, index) => {
                        return <Box key={index} sx={{
                            mx: 1, mb: .5, display: 'flex', alignItems: 'center',
                            ":hover": { color: 'black', background: '#4F92AB10' },
                            fontSize: '12px', cursor: 'pointer', py: .4,
                            color: filterSearchBy === item?.id ? 'white' : 'black',
                            minWidth: 'max-content', borderRadius: '12px', border: '1px solid #1414171A',
                            px: 1, bgcolor: filterSearchBy === item?.id ? 'primary.main' : 'white'
                        }} onClick={() => { filterSearchResult(item.id) }}>
                            {icons('15')[item.id]} <Typography sx={{ ml: 1, fontSize: 12 }}>{item.label}</Typography>
                        </Box>
                    })}
                </Box>
            </Box>

            <Box sx={{ width: '100%', maxHeight: '400px', overflowY: 'auto', }}>
                {(filterSearchBy
                    ? searchResult?.filter(item => item?.section === filterSearchBy)
                    : searchResult)?.map((section, indx) => {
                        const item = section?.data;
                        return <Box key={indx} sx={{
                            background: 'white', borderBottom: '1px solid #1414171A', display: 'flex',
                            flexDirection: 'column', ":hover": { background: '#4F92AB10' },
                            maxWidth: '100%', px: 1.5, py: 1, display: 'flex', cursor: 'pointer',
                            alignItems: 'flex-start', justifyContent: 'center'
                        }}
                            onClick={() => { handleSearchClick(item?.id, item?.url) }}>
                            <Box sx={{
                                fontSize: '11px', color: 'primary.main', mb: .3, background: '#4F92AB1A',
                                display: 'flex', alignItems: 'center', maxWidth: 'max-content',
                                px: 1, py: .3, borderRadius: '4px'
                            }}>
                                {icons('14')[section.section]}
                                <Typography sx={{ mt: .2, ml: 1, fontSize: 11, fontWeight: 600 }}>
                                    {section.label}
                                </Typography>
                            </Box>

                            <Typography sx={{
                                fontSize: 12, display: 'block', lineHeight: '23px', maxHeight: '46px', overflow: 'clip',
                                textTransform: section?.noCapitalize ? 'none' : 'capitalize', textOverflow: 'clip',
                                wordBreak: 'break-all'
                            }}>
                                {item?.value}
                            </Typography>
                        </Box>
                    })}
            </Box>

        </Box>}
    </Box>
}