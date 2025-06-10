// dateUtils.js

export function formatDate(dateString) {
    if (!dateString) return '-'
    const date = new Date(dateString)

    const pad = (n) => String(n).padStart(2, '0')

    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hour = pad(date.getHours())
    const minute = pad(date.getMinutes())
    const second = pad(date.getSeconds())

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export function formatDateOnly(dateString) {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}