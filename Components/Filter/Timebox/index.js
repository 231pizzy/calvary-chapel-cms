export default function TimeBox({ data, item, finalFilter, handleChange }) {
    return <div style={{
        /* display: 'flex', flexWrap: 'wrap', */
    }}>
        <input
            value={finalFilter[item?.value]?.filter}
            placeholder={item?.label}
            type='time'
            style={{
                height: '30px', padding: '4px 8px', width: '80%', border: '.5px solid grey'
            }}
            onChange={(event) => { handleChange({ type: 'timebox', id: item?.value, value: event.currentTarget.value }) }}
        />
    </div>
}