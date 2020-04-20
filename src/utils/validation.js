module.exports = {
  error: '',
  check: function (data, rule) {
    for (let i = 0; i < rule.length; i++) {
      if (!rule[i].checkType) {
        return true
      }
      if (!rule[i].name) {
        return true
      }
      if (!rule[i].errorMsg) {
        return true
      }
      if (!data[rule[i].name]) {
        this.error = rule[i].errorMsg
        return false
      }
      switch (rule[i].checkType) {
        case 'string':
          let regString = new RegExp('^.{' + rule[i].checkRule + '}$')
          if (!regString.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'int':
          let regInt = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$')
          if (!regInt.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'between':
          if (!this.isNumber(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          let minMaxBetween = rule[i].checkRule.split(',')
          minMaxBetween[0] = Number(minMaxBetween[0])
          minMaxBetween[1] = Number(minMaxBetween[1])
          if (data[rule[i].name] > minMaxBetween[1] || data[rule[i].name] < minMaxBetween[0]) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'betweenD':
          let regBetweenD = /^-?[1-9][0-9]?$/
          if (!regBetweenD.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          let minMaxBetweenD = rule[i].checkRule.split(',')
          minMaxBetweenD[0] = Number(minMaxBetweenD[0])
          minMaxBetweenD[1] = Number(minMaxBetweenD[1])
          if (data[rule[i].name] > minMaxBetweenD[1] || data[rule[i].name] < minMaxBetweenD[0]) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'betweenF':
          let regBetweenF = /^-?([0-9]{1,}[.][0-9]*)$/
          if (!regBetweenF.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          let minMaxBetweenF = rule[i].checkRule.split(',')
          minMaxBetweenF[0] = Number(minMaxBetweenF[0])
          minMaxBetweenF[1] = Number(minMaxBetweenF[1])
          if (data[rule[i].name] > minMaxBetweenF[1] || data[rule[i].name] < minMaxBetweenF[0]) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'same':
          if (data[rule[i].name] !== rule[i].checkRule) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'notsame':
          if (data[rule[i].name] === rule[i].checkRule) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'email':
          const regEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          if (!regEmail.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'phoneno':
          let regPhoneNo = /^1[0-9]{10,10}$/
          if (!regPhoneNo.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'zipcode':
          let regZipCode = /^[0-9]{6}$/
          if (!regZipCode.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'reg':
          let reg = new RegExp(rule[i].checkRule)
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'in':
          if (rule[i].checkRule.indexOf(data[rule[i].name]) === -1) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        case 'notnull':
          if (data[rule[i].name] == null || data[rule[i].name].length < 1) {
            this.error = rule[i].errorMsg
            return false
          }
          break
      }
    }
    return true
  },
  isNumber: function (checkVal) {
    let reg = /^(-?\d+)(\.\d+)?$/
    return checkVal === '0' || reg.test(checkVal)
  }
}
