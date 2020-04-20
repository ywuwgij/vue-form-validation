<template>
  <div class="hello">
    <form-container @validation="validation">
      <form-item checkType="string" title="姓名" required="true" checkRule="1,3">
        <input v-model="formData.nickname" />
      </form-item>
      <form-item checkType="in" checkRule="男,女" title="性别" required="true">
        <select v-model="formData.gender">
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </form-item>
      <form-item title="出生日期" required="true">
        <input v-model="formData.bd" type="date" />
      </form-item>
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
      formData: {
        nickname: 'jim',
        gender: '',
        bd: ''
      }
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
