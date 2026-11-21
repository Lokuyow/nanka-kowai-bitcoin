<script>
  let { layer } = $props();
</script>

<span class="layer-label">
  <span class="layer-number">{layer.number}</span>
  <span data-i18n>{layer.title}</span>
</span>
