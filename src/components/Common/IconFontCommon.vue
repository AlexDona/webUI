<template>
  <svg
    class="icon"
    :class="className"
    aria-hidden="true"
  >
    <use :xlink:href="`#${iconName}`"></use>
  </svg>
</template>
<script>
export default {
  props: ['className', 'iconName'],
  data () {
    return {}
  }
}
</script>
