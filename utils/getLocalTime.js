import moment from "moment";

export const getLocalTime = ({ date, time, type, timeFormat, dateFormat, outputFormat }) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('time zone', timeZone)
    if (type === 'time') {
        const utcFormatted = moment.utc(`${dateFormat ? moment(date, dateFormat).format('yyyy-MM-DD').toString() : date} ${moment(time, timeFormat ?? 'HH:mm').format('HH:mm:ss').toString()}`) //new Date(`${moment(date, 'DD/MM/yyyy').format('yyyy-MM-DD').toString()} ${moment(time, 'h:mm a').format('hh:mm:ss').toString()}`)//.toUTCString()

        const res = utcFormatted.local().format(outputFormat ?? 'HH:mm').toString()//(utcFormatted.toLocaleString('en-US', { timeZone: timeZone })).format('h:mm a').toString()
        console.log('utc time', res, utcFormatted);
        return res
    }
    else {
        const utcFormatted = moment.utc(`${moment(date, 'DD/MM/yyyy').format('yyyy-MM-DD').toString()}`) //new Date(`${moment(date, 'DD/MM/yyyy').format('yyyy-MM-DD').toString()}`)//.toUTCString()
        return utcFormatted.local().format('DD/MM/yyyy').toString() //moment(utcFormatted.toLocaleString('en-US', { timeZone: timeZone })).format('DD/MM/yyyy').toString()
    }
}