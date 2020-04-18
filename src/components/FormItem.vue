<template>
  <div style="display:-webkit-inline-box" v-bind:class="[currentClass]">
    <label>{{title}}:</label>
    <slot></slot>
    <span style="padding-left:5px;" v-if="errorMessage">{{errorMessage}}</span>
  </div>
</template>

<script>
import validation from '../utils/validation'
export default {
  props: {
    //   是否是必填项
    required: {
      default: 'false'
    },
    // 验证类型
    checkType: {
      default: 'string'//   string, int, between, betweenD, betweenF, same, notsame, email, phoneno, zipcode, reg, in, Function
    },
    // 验证规则/数据
    checkRule: {
      default: null
    },
    // 最大长度（仅支持字符串）
    maxLength: {
      type: Number,
      default: -1
    },
    // 最小长度（仅支持字符串）
    minLength: {
      type: Number,
      default: 0
    },
    // 最大值（仅支持between, betweenD, betweenF）
    maxValue: {
      type: Number,
      default: Number.MAX_VALUE
    },
    // 最小值（仅支持between, betweenD, betweenF）
    minValue: {
      type: Number,
      default: Number.MIN_VALUE
    },
    // 消息
    msg: {
      type: Object,
      default: null
    },
    // 标题
    title: {
      type: String,
      default: ''
    }
  },
  name: 'FormItem',
  data() {
    return {
      errorMessage: null,
      currentClass: '',
      inputElm: null
    }
  },
  mounted() {
    var self = this
    var findElement = (vnode, tags) => {
      let _tags = tags.map(p => p.toUpperCase())
      if (_tags.indexOf(vnode.tag.toUpperCase()) >= 0) {
        return vnode.elm
      } else {
        var element = null
        for (var index in vnode.children) {
          var elm = findElement(vnode.children[index], tags)
          if (elm !== null && _tags.indexOf(vnode.tag.toUpperCase()) >= 0) {
            element = elm
            break
          }
        }
        return element
      }
    }

    var message = {
      ...{
        'required': `${self.title}不能为空`,
        'int': `${self.title}必须为整数`,
        'between': `${self.title}必须是在{0}与{1}之间的数值格式`,
        'betweenD': `${self.title}必须是在{0}与{1}之间的整数格式`,
        'betweenF': `${self.title}必须在{0}与{1}之间的小数格式`,
        'same': `${self.title}输入不匹配`,
        'notsame': `${self.title}输入不匹配`,
        'email': `${self.title}不是合法的电子邮件格式`,
        'phoneno': `${self.title}不是合法的手机号码格式`,
        'zipcode': `${self.title}不是合法的邮政编码格式`,
        'reg': `${self.title}不是合法的格式`,
        'in': `${self.title}不是合法的数据`
      },
      ...self.msg
    }

    // 获得范围表达式
    var getRangeRule = (rule, defaultMin, defaultMax) => {
      var minMax = self.checkRule ? self.checkRule.split(',') : [defaultMin, defaultMax]
      var ruleValue = ''
      if (minMax.length === 2) {
        if (validation.isNumber(minMax[0])) {
          var min = validation.isNumber(minMax[0]) ? minMax[0] : defaultMin
          var max = validation.isNumber(minMax[1]) ? minMax[1] : defaultMax
          ruleValue = `${min},${max}`
        }
      }
      return ruleValue
    }

    var defaultSlot = self.$slots['default']
    if (defaultSlot) {
      if (defaultSlot.length > 0) {
        var defaultNode = defaultSlot[0]
        if (defaultNode) {
          self.inputElm = findElement(defaultNode, ['input', 'select'])
          var rules = []
          var required = self.required === true || self.required === 'true' || self.inputElm.required
          if (required) {
            self.inputElm.removeAttribute('required')
            rules.push({
              name: 'input_value',
              checkType: 'notnull',
              errorMsg: message['required']
            })
          }

          if (self.checkType === 'string') {
            //   最大长度
            var maxLength = self.maxLength || self.inputElm.maxLength
            if (maxLength !== -1) {
              self.inputElm.maxLength = maxLength
            }

            // TODO 最小长度验证
          }

          // 整型、电子邮件地址、手机号码及邮政编码验证
          if (['int', 'email', 'phoneno', 'zipcode'].indexOf(self.checkType) >= 0) {
            let checkRule = ''
            if (self.checkType === 'int') {
              checkRule = getRangeRule(self.checkRule, '0', '999999999999')
            }
            rules.push({
              name: 'input_value',
              checkType: self.checkType,
              checkRule: checkRule,
              errorMsg: message[self.checkType]
            })
          }

          // 数值区间
          if (['between', 'betweenD', 'betweenF'].indexOf(self.checkType) >= 0) {
            if (self.checkRule) {
              let rangeValue = getRangeRule(self.checkRule,
                validation.isNumber(self.inputElm.min) ? self.inputElm.min : '0',
                validation.isNumber(self.inputElm.min) ? self.inputElm.max : '-1')
              let min = rangeValue.split(',')[0]
              let max = rangeValue.split(',')[1]
              rules.push({
                name: 'input_value',
                checkType: self.checkType,
                checkRule: rangeValue,
                errorMsg: message[self.checkType].replace('{0}', min).replace('{1}', max)
              })
            }
          }

          // 相同或不相同校验及正则表达式
          if (['same', 'notsame', 'reg'].indexOf(self.checkType) >= 0) {
            if (self.checkRule) {
              rules.push({
                name: 'input_value',
                checkType: self.checkType,
                checkRule: self.checkRule,
                errorMsg: message[self.checkType].replace('{0}', self.checkRule)
              })
            }
          }

          // 包含验证
          if (self.checkType === 'in') {
            if (self.checkRule) {
              var ruleData = null
              if (Array.isArray(self.checkRule)) {
                ruleData = self.checkRule
              } else if (typeof self.checkRule === 'string') {
                ruleData = self.checkRule.split(',')
              }
              rules.push({
                name: 'input_value',
                checkType: self.checkType,
                checkRule: ruleData,
                errorMsg: message[self.checkType].replace('{0}', self.checkRule)
              })
            }
          }

          let eventName = 'change'
          self.inputElm.__valid = function () {
            if (self.inputElm.value || self.required === true || self.required === 'true' || self.inputElm.required) {
              var data = {
                'input_value': self.inputElm.value
              }
              self.errorMessage = null
              self.currentClass = null

              for (let index = 0; index < rules.length; index++) {
                const rule = rules[index]
                if (typeof rule === 'function') {
                  var result = rule(data)
                  if (result) {
                    self.errorMessage = result
                    self.currentClass = 'error'
                    break
                  }
                } else {
                  if (!validation.check(data, [rule])) {
                    self.errorMessage = validation.error
                    self.currentClass = 'error'
                    break
                  }
                }
              }
            } else {
              self.errorMessage = null
              self.currentClass = ''
            }
            return !self.currentClass
          }
          self.inputElm.addEventListener(eventName, self.inputElm.__valid)
        }
      }
    }
  },
  methods: {
    valid() {
      return this.inputElm && this.inputElm.__valid ? this.inputElm.__valid() : true
    }
  }
}
</script>

<style lang="css" scoped>
.error input {
  border-color: #f5222d;
}
.error span {
  color: #f5222d;
}
</style>
