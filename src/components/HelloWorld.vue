<template>
  <div class="hello">
    <form-container @validation="validation">
      <div v-for="item in formData" :key="item.name">
        <form-item
          :checkType="item.checkType"
          :checkRule="item.checkRule"
          :title="item.name"
          :required="item.required"
        >
          <input v-model="item.value" />
        </form-item>
      </div>
      <button type="submit">提交</button>
    </form-container>
  </div>
</template>

<script>
import FormItem from './FormItem'
import FormContainer from './FormContainer'
export default {
  components: { FormItem, FormContainer },
  name: 'Home',
  data() {
    return {
      formData: [
        { name: 'nickname', value: 'jim', required: true, checkType: 'string', checkRule: '1,3', errorMsg: '姓名应为1-3个字符' },
        { name: 'gender', value: '男', required: true, checkType: 'in', checkRule: '男,女', errorMsg: '请选择性别' },
        { name: 'bd', value: '1972-1-3', required: false, checkType: 'notsame', checkRule: '请选择', errorMsg: '请选择生日' },
        { name: 'aihao', value: '足球', required: false, checkType: 'notnull', checkRule: '', errorMsg: '请选择爱好' },
        { name: 'email', value: '52665060@qq.com', required: true, checkType: 'email', checkRule: '', errorMsg: '请填写您的邮箱' }
      ]
    }
  },
  methods: {
    validation(result) {
      if (result) {
        alert(`提交${JSON.stringify(this.formData)}`)
      }
    }
  }
}
</script>
