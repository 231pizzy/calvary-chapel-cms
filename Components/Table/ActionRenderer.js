
import { ApprovedSvg } from '@/public/icons/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import WarningModal from '../WarningModal/WarningModal';

const ActionRenderer = (props) => {
    const router = useRouter();

    const [showWarning, setShowWarning] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showDraftWarning, setShowDraftWarning] = useState(false);

    const { editUrl, viewUrl, replyUrl, viewId, notifyUrl, draftUrl, deleteEndpoint, title,
        draft } = props.colDef.cellRendererParams


    const handleView = () => {
        router.push(`${viewUrl/*  router.pathname.split('/').pop() */}?id=${props.data[viewId ?? 'id']}`)
    }

    const closeModal = () => {
        setShowWarning(false);
    }

    const handleDelete = () => {

    }

    const handleEdit = () => {
        console.log('props data', props?.data);
        (draft && props?.data?.stage !== 'draft' && props?.data?.stage !== 'saved') ? setShowDraftWarning(true) : router.push(`${editUrl}?id=${props.data.id}`)
    }

    const handleEmail = () => {
        // router.push(`${router.pathname.split('/').pop()}/edit?id=${props.data.id}`)
    }

    const handleNotify = () => {
        router.push(`${notifyUrl}?id=${props.data.id}`)
    }

    const handleReply = () => {
        router.push(`${replyUrl}?id=${props.data.id}`)
    }

    const handleSetting = () => {
        //  router.push(`${replyUrl}?id=${props.data.id}`)
    }

    const handleSetDefaultEmail = async (ev) => {
        setProcessing(true)
        const response = await fetch(`/api/set-default-contact-form-email?id=${props?.data?.id}`, { method: 'GET' });
        const { result, loginRedirect } = await response.json();
        loginRedirect && window.location.replace('/login')

        if (result) {
            setProcessing(false)
            window.location.reload()
        }
    }

    const actionData = {
        delete: {
            icon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={handleDelete}>
                <path d="M2.5 5H4.16667H17.5" stroke="#6F3D17" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.8337 5.00033V16.667C15.8337 17.109 15.6581 17.5329 15.3455 17.8455C15.0329 18.1581 14.609 18.3337 14.167 18.3337H5.83366C5.39163 18.3337 4.96771 18.1581 4.65515 17.8455C4.34259 17.5329 4.16699 17.109 4.16699 16.667V5.00033M6.66699 5.00033V3.33366C6.66699 2.89163 6.84259 2.46771 7.15515 2.15515C7.46771 1.84259 7.89163 1.66699 8.33366 1.66699H11.667C12.109 1.66699 12.5329 1.84259 12.8455 2.15515C13.1581 2.46771 13.3337 2.89163 13.3337 3.33366V5.00033" stroke="#6F3D17" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.33398 9.16699V14.167" stroke="#6F3D17" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.667 9.16699V14.167" stroke="#6F3D17" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        },
        view: {
            icon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={handleView}>
                <g clipPath="url(#clip0_378_6691)">
                    <path d="M10.0627 17C8.97453 17.0024 7.89664 16.7892 6.89132 16.3726C5.886 15.9561 4.97318 15.3445 4.20559 14.5731L0.176373 10.5517C0.103467 10.4794 0.0456003 10.3934 0.0061104 10.2986C-0.0333795 10.2038 -0.0537109 10.1021 -0.0537109 9.99946C-0.0537109 9.89677 -0.0333795 9.7951 0.0061104 9.70032C0.0456003 9.60553 0.103467 9.5195 0.176373 9.44719L4.20559 5.42578C5.7591 3.87256 7.86594 3 10.0627 3C12.2595 3 14.3664 3.87256 15.9199 5.42578L19.9491 9.44719C20.022 9.5195 20.0799 9.60553 20.1193 9.70032C20.1588 9.7951 20.1792 9.89677 20.1792 9.99946C20.1792 10.1021 20.1588 10.2038 20.1193 10.2986C20.0799 10.3934 20.022 10.4794 19.9491 10.5517L15.9199 14.5731C15.1523 15.3445 14.2395 15.9561 13.2341 16.3726C12.2288 16.7892 11.1509 17.0024 10.0627 17ZM1.8254 9.99946L5.30234 13.4764C6.56639 14.7361 8.27818 15.4434 10.0627 15.4434C11.8473 15.4434 13.5591 14.7361 14.8231 13.4764L18.3001 9.99946L14.8231 6.52253C13.5591 5.26286 11.8473 4.55555 10.0627 4.55555C8.27818 4.55555 6.56639 5.26286 5.30234 6.52253L1.8254 9.99946Z" fill="#6F3D17" />
                    <path d="M10.0625 13.1104C9.44717 13.1104 8.84562 12.9279 8.33396 12.586C7.8223 12.2442 7.4235 11.7582 7.18801 11.1897C6.95252 10.6212 6.8909 9.99559 7.01096 9.39205C7.13101 8.78851 7.42734 8.23412 7.86247 7.79899C8.2976 7.36386 8.85199 7.06753 9.45554 6.94748C10.0591 6.82743 10.6847 6.88904 11.2532 7.12453C11.8217 7.36002 12.3077 7.75881 12.6495 8.27047C12.9914 8.78213 13.1739 9.38368 13.1739 9.99904C13.1739 10.8242 12.8461 11.6156 12.2626 12.1991C11.6791 12.7826 10.8877 13.1104 10.0625 13.1104ZM10.0625 8.44337C9.75485 8.44337 9.45408 8.53461 9.19825 8.70555C8.94242 8.87649 8.74302 9.11945 8.62527 9.40371C8.50753 9.68797 8.47672 10.0008 8.53675 10.3025C8.59677 10.6043 8.74494 10.8815 8.9625 11.0991C9.18007 11.3166 9.45727 11.4648 9.75904 11.5248C10.0608 11.5848 10.3736 11.554 10.6579 11.4363C10.9421 11.3186 11.1851 11.1192 11.356 10.8633C11.527 10.6075 11.6182 10.3067 11.6182 9.99904C11.6182 9.58645 11.4543 9.19076 11.1626 8.89902C10.8708 8.60727 10.4751 8.44337 10.0625 8.44337Z" fill="#6F3D17" />
                </g>
                <defs>
                    <clipPath id="clip0_378_6691">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        },
        edit: {
            icon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={handleEdit}>
                <g clipPath="url(#clip0_378_3705)">
                    <path d="M9.16699 3.33301H3.33366C2.89163 3.33301 2.46771 3.5086 2.15515 3.82116C1.84259 4.13372 1.66699 4.55765 1.66699 4.99967V16.6663C1.66699 17.1084 1.84259 17.5323 2.15515 17.8449C2.46771 18.1574 2.89163 18.333 3.33366 18.333H15.0003C15.4424 18.333 15.8663 18.1574 16.1788 17.8449C16.4914 17.5323 16.667 17.1084 16.667 16.6663V10.833" stroke="#6F3D17" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.417 2.0832C15.7485 1.75168 16.1982 1.56543 16.667 1.56543C17.1358 1.56543 17.5855 1.75168 17.917 2.0832C18.2485 2.41472 18.4348 2.86436 18.4348 3.3332C18.4348 3.80204 18.2485 4.25168 17.917 4.5832L10.0003 12.4999L6.66699 13.3332L7.50033 9.99986L15.417 2.0832Z" stroke="#6F3D17" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_378_3705">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        },
        email: {
            icon: <svg width="16" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={handleEmail}>
                <path fillRule="evenodd" clipRule="evenodd"
                    d="M2.7 0C1.20883 0 0 1.17525 0 2.625V11.375C0 12.8247 1.20883 14 2.7 14H15.3C16.7912 14 18 12.8247 18 11.375V2.625C18 1.17525 16.7912 0 15.3 0H2.7ZM2.54296 1.76327C2.59396 1.75455 2.64643 1.75 2.7 1.75H15.3C15.3536 1.75 15.4061 1.75455 15.4571 1.76328L9.00001 5.9484L2.54296 1.76327ZM1.8 3.38496V11.375C1.8 11.8582 2.20294 12.25 2.7 12.25H15.3C15.7971 12.25 16.2 11.8582 16.2 11.375V3.38498L9.49924 7.72806C9.19693 7.924 8.80309 7.924 8.50078 7.72806L1.8 3.38496Z" fill="#6F3D17" />
            </svg>
        },
        notify: {
            icon: <div style={{ position: 'relative' }} onClick={handleNotify}>
                {props?.data?.notifications > 0 && <span style={{
                    fontSize: '10px', position: 'absolute', justifyContent: 'flex-end', padding: '4px',
                    background: '#FFC326', borderRadius: '100%', color: 'black', maxHeight: '12px',
                    top: '4px', right: '-4px', display: 'flex', alignItems: 'center', maxWidth: '12px'
                }}>
                    {props?.data?.notifications}
                </span>}
                <span style={{ width: '14px', height: '14px' }}>
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12.7911 9.51275L12.488 9.26885C12.4065 9.2036 12.3407 9.12088 12.2955 9.0268C12.2502 8.93272 12.2267 8.82967 12.2267 8.72528V5.90989C12.2262 4.69999 11.8061 3.52771 11.0379 2.593C10.2696 1.6583 9.20092 1.01906 8.01401 0.784343C7.95614 0.559879 7.8253 0.361017 7.64206 0.219034C7.45883 0.0770504 7.2336 0 7.00179 0C6.76999 0 6.54476 0.0770504 6.36152 0.219034C6.17829 0.361017 6.04745 0.559879 5.98957 0.784343C4.80202 1.01835 3.7325 1.65728 2.96358 2.59205C2.19466 3.52683 1.77401 4.6995 1.77345 5.90989V8.72528C1.77339 8.82967 1.74987 8.93272 1.70464 9.0268C1.6594 9.12088 1.59361 9.2036 1.51212 9.26885L1.20898 9.51275C0.842865 9.80545 0.547022 10.1765 0.343208 10.5986C0.139394 11.0207 0.0327948 11.4831 0.03125 11.9518V12.5302C0.03125 12.8999 0.178092 13.2544 0.439473 13.5158C0.700854 13.7772 1.05536 13.924 1.42501 13.924H4.30312C4.4602 14.519 4.80976 15.0453 5.29729 15.4208C5.78482 15.7964 6.38292 16 6.99831 16C7.6137 16 8.21179 15.7964 8.69932 15.4208C9.18685 15.0453 9.53641 14.519 9.69349 13.924H12.5751C12.9447 13.924 13.2992 13.7772 13.5606 13.5158C13.822 13.2544 13.9689 12.8999 13.9689 12.5302V11.9588C13.9683 11.4889 13.8623 11.0251 13.6584 10.6017C13.4545 10.1783 13.1582 9.80618 12.7911 9.51275ZM7.00005 14.6209C6.75682 14.6194 6.51821 14.5543 6.30793 14.4321C6.09765 14.3098 5.92303 14.1346 5.80142 13.924H8.20217C8.08026 14.1352 7.90509 14.3106 7.69415 14.4329C7.4832 14.5552 7.24387 14.62 7.00005 14.6209ZM12.5751 12.5302H1.42501V11.9588C1.42538 11.6977 1.48445 11.44 1.59783 11.2048C1.71122 10.9695 1.87603 10.7628 2.08008 10.5999L2.38322 10.356C2.62769 10.1602 2.82507 9.91209 2.96077 9.62984C3.09646 9.34759 3.16701 9.03846 3.16721 8.72528V5.90989C3.16721 4.89336 3.57103 3.91846 4.28982 3.19967C5.00862 2.48087 5.98352 2.07705 7.00005 2.07705C8.01658 2.07705 8.99148 2.48087 9.71028 3.19967C10.4291 3.91846 10.8329 4.89336 10.8329 5.90989V8.72528C10.8326 9.03904 10.9029 9.34886 11.0386 9.63175C11.1743 9.91464 11.372 10.1634 11.6169 10.3595L11.92 10.6034C12.1236 10.7659 12.2881 10.9721 12.4015 11.2067C12.5149 11.4413 12.5742 11.6983 12.5751 11.9588V12.5302Z" fill="#6F3D17" />
                    </svg>
                </span>
            </div>
        },
        reply: {
            icon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={handleReply}>
                <path d="M18.75 18.125C18.6514 18.1253 18.5541 18.1022 18.4661 18.0576C18.3781 18.0131 18.3019 17.9484 18.2437 17.8687L16.9188 16.0437C15.1116 13.5663 12.4015 11.9002 9.375 11.4062V13.75C9.375 13.8661 9.34268 13.9798 9.28166 14.0786C9.22064 14.1773 9.13332 14.2571 9.02951 14.309C8.92569 14.3609 8.80947 14.3829 8.69387 14.3725C8.57827 14.3621 8.46786 14.3196 8.375 14.25L0.875 8.625C0.797377 8.56678 0.734375 8.49129 0.690983 8.40451C0.647591 8.31772 0.625 8.22203 0.625 8.125C0.625 8.02797 0.647591 7.93228 0.690983 7.84549C0.734375 7.75871 0.797377 7.68322 0.875 7.625L8.375 2C8.46786 1.93036 8.57827 1.88795 8.69387 1.87753C8.80947 1.8671 8.92569 1.88908 9.02951 1.94098C9.13332 1.99289 9.22064 2.07268 9.28166 2.17142C9.34268 2.27015 9.375 2.38393 9.375 2.5V5.15C12.1638 5.59594 14.7025 7.02125 16.5352 9.17013C18.3679 11.319 19.3748 14.0507 19.375 16.875V17.5C19.3749 17.6318 19.3331 17.7602 19.2557 17.8668C19.1782 17.9735 19.0691 18.0529 18.9438 18.0938C18.881 18.1132 18.8157 18.1237 18.75 18.125ZM8.75 10.0688H8.8125C10.6151 10.2547 12.3585 10.8176 13.9295 11.721C15.5004 12.6244 16.8638 13.848 17.9312 15.3125L18.0312 15.4437C17.7106 13.0949 16.6135 10.9207 14.9147 9.26724C13.2159 7.61373 11.0129 6.57586 8.65625 6.31875C8.50268 6.30176 8.36084 6.22848 8.25811 6.11306C8.15539 5.99764 8.09906 5.84826 8.1 5.69375V3.75L2.29375 8.125L8.125 12.5V10.6938C8.12521 10.6065 8.14366 10.5203 8.17918 10.4407C8.21471 10.361 8.2665 10.2897 8.33125 10.2313C8.44587 10.1271 8.5951 10.0692 8.75 10.0688Z" fill="#6F3D17" />
            </svg>
        },
        setting: {
            icon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                onClick={handleSetting}>
                <path fillRule="evenodd" clipRule="evenodd" d="M19.5792 14.1339C20.4455 12.699 19.9314 10.8642 18.4309 10.0358L18.3659 9.99994L18.4308 9.9641C19.9313 9.13567 20.4454 7.3009 19.5791 5.86603L18.5334 4.13398C17.6671 2.6991 15.7484 2.20747 14.2479 3.0359L14.1829 3.0718V3C14.1829 1.34315 12.7783 2.94419e-07 11.0457 2.90038e-07L8.95424 0C7.22162 2.02095e-07 5.81706 1.34315 5.81706 3L5.81706 3.07168L5.75209 3.03582C4.2516 2.20739 2.33293 2.69902 1.46662 4.13389L0.420888 5.86594C-0.445422 7.30082 0.0686834 9.13559 1.56918 9.96402L1.63424 9.99994L1.56912 10.0359C0.0686248 10.8643 -0.445483 12.6991 0.420826 14.134L1.46655 15.866C2.33287 17.3009 4.25154 17.7925 5.75203 16.9641L5.81705 16.9282V17C5.81705 18.6569 7.22162 20 8.95424 20H11.0457C12.7783 20 14.1829 18.6569 14.1829 17V16.9281L14.248 16.964C15.7485 17.7924 17.6671 17.3008 18.5334 15.8659L19.5792 14.1339ZM15.2286 4.80384C13.8343 5.57365 12.0914 4.6114 12.0914 3.07179V3C12.0914 2.44772 11.6232 2 11.0457 2L8.95424 2C8.37672 2 7.90855 2.44768 7.90851 2.99994L7.90851 3.07169C7.90851 4.61124 6.16573 5.57349 4.77142 4.80378L4.70637 4.76787C4.2062 4.49173 3.56664 4.6556 3.27787 5.13389L2.23214 6.86594C1.94337 7.34424 2.11474 7.95583 2.61491 8.23197L2.67988 8.26784C4.07427 9.03759 4.07432 10.9622 2.67996 11.732L2.61485 11.7679C2.11468 12.0441 1.94331 12.6557 2.23208 13.134L3.27781 14.866C3.56658 15.3443 4.20614 15.5082 4.7063 15.232L4.77133 15.1961C6.16564 14.4264 7.90851 15.3886 7.90851 16.9282V17C7.90851 17.5523 8.3767 18 8.95424 18H11.0457C11.6232 18 12.0914 17.5523 12.0914 17V16.9281C12.0914 15.3884 13.8344 14.4262 15.2287 15.1961L15.2937 15.232C15.7939 15.5081 16.4334 15.3442 16.7222 14.8659L17.7679 13.1339C18.0567 12.6556 17.8853 12.044 17.3852 11.7679L17.3201 11.7319C15.9259 10.9621 15.9259 9.03768 17.3202 8.2679L17.3851 8.23205C17.8853 7.9559 18.0566 7.34431 17.7679 6.86603L16.7221 5.13398C16.4334 4.65568 15.7938 4.49181 15.2936 4.76795L15.2286 4.80384Z" fill="#6F3D17" />
                <path fillRule="evenodd" clipRule="evenodd" d="M9.99978 11.9999C11.1549 11.9999 12.0912 11.1045 12.0912 9.99994C12.0912 8.89537 11.1549 7.99994 9.99978 7.99994C8.8447 7.99994 7.90833 8.89537 7.90833 9.99994C7.90833 11.1045 8.8447 11.9999 9.99978 11.9999ZM9.99978 13.9999C12.3099 13.9999 14.1827 12.2091 14.1827 9.99994C14.1827 7.7908 12.3099 5.99994 9.99978 5.99994C7.68962 5.99994 5.81687 7.7908 5.81687 9.99994C5.81687 12.2091 7.68962 13.9999 9.99978 13.9999Z" fill="#6F3D17" />
            </svg>

        },
        approve: {
            icon: <ApprovedSvg style={{ width: '30px', height: '30px', }} onClick={() => { setShowWarning(true) }} />
        }
    }

    return (
        !props?.data?.id ? <div></div> : <div style={{
            width: '100%',
            padding: '4px 4px', verticalAlign: 'middle', maxWidth: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {props?.value?.map((item, index) => {
                return <div key={index} style={{
                    marginRight: '4px', cursor: 'pointer', width: '100%', textAlign: 'right'
                }}>
                    {actionData[item]?.icon}
                </div>
            })}

            {showWarning && <WarningModal
                title={`Set as default email`}
                open={showWarning}
                message={'This email address will be made the default email address for sending replies to enquiries'}
                status={processing ? 'submitting' : null}
                proceedAction={async () => { await handleSetDefaultEmail() }}
                handleCancel={closeModal}
            />}

        </div>
    );
}

export default ActionRenderer