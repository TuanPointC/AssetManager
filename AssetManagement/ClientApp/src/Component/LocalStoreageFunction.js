export const SetLocalStoreageFunction = async (res) => {
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('userUserName', res.data.userName)
    localStorage.setItem('userId', res.data.userId)
    localStorage.setItem('userGender', res.data.userGender)
    localStorage.setItem('userRole', res.data.userRole)
    localStorage.setItem('userFirstName', res.data.userFirstName)
    localStorage.setItem('userLastName', res.data.userLastName)
    localStorage.setItem('userStaffCode', res.data.userStaffCode)
    localStorage.setItem('userLocation', res.data.userLocation)
    localStorage.setItem('userJoinedDate', res.data.userJoinedDate)
    localStorage.setItem('userDateOfBirth', res.data.userDateOfBirth)
    localStorage.setItem('userLastLogin',res.data.userLastLogin)
}

export const RemoveLocalStorage = async () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userUserName")
    localStorage.removeItem("userId")
    localStorage.removeItem("userGender")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userFirstName")
    localStorage.removeItem("userLastName")
    localStorage.removeItem("userStaffCode")
    localStorage.removeItem("userLocation")
    localStorage.removeItem("userJoinedDate")
    localStorage.removeItem("userDateOfBirth")
    localStorage.removeItem("userLastLogin")
}