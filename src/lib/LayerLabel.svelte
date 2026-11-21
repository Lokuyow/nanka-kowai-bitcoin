<script>
  let { layer } = $props();
</script>

<span class="layer-label">
  <span class="layer-number" data-i18n data-i18n-en={'Layer ' + layer.number}>第{layer.number}層</span>
  <span data-i18n>{layer.title}</span>
</span>
