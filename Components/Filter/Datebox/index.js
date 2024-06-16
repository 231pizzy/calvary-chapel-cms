export default function DateBox({ data, item, finalFilter, handleChange }) {
    return <div style={{
        /* display: 'flex', flexWrap: 'wrap', */
    }}>
        <input
            value={finalFilter[item?.value]?.filter}
            placeholder={item?.label}
            type='date'
            style={{
                height: '30px', padding: '4px 8px', width: '80%', border: '.5px solid grey'
            }}
            onChange={(event) => { handleChange({ type: 'datebox', id: item?.value, value: event.currentTarget.value }) }}
        />
    </div>
}