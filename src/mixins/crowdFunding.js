/**
 * author: zhaoxinlei
 * create: 20190606
 * description: 众筹 相关 mixins
 */
import {
  mapGetters,
  mapState,
  mapActions
} from 'vuex'

let mixin = {
  data () {
    return {}
  },
  methods: {
    ...mapActions([])
  },
  computed: {
    ...mapGetters({}),
    ...mapState({})
  },
  destroyed () {
  },
  filters: {
    timerFormat1_F_X: function (date, type) {
      console.log(date, new Date(date).getMonth())
      const newDate = new Date(date)
      const years = `${newDate.getFullYear()}`
      const months = `${newDate.getMonth() + 1}`.padStart(2, '0')
      const days = `${newDate.getDate()}`.padStart(2, '0')
      const hours = `${newDate.getHours()}`.padStart(2, '0')
      const minutes = `${newDate.getMinutes()}`.padStart(2, '0')
      const seconds = `${newDate.getSeconds()}`.padStart(2, '0')
      let finalDate = ''
      switch (type) {
        case 'date':
          finalDate = `${years}/${months}/${days}`
          break
        case 'time':
          finalDate = `${hours}:${minutes}:${seconds}`
          break
        default:
          finalDate = `${years}/${months}/${days} ${hours}:${minutes}:${seconds}`
      }
      return finalDate
    }
  },
  watch: {}
}
export default mixin
