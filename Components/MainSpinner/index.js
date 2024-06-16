export default function MainSpinner() {
    return <div style={{
        maxWidth: '50vh', maxHeight: '50vh', margin: 'auto', position: 'fixed',
        left: 0, right: 0, top: 0, bottom: 0, zIndex: 6545,
    }}>
        <img src='/images/spinner.gif' alt="gif" />
    </div>
}