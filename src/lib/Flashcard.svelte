<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  interface Props {
    front: string | undefined;
    back: string | undefined;
    showCardBack: boolean;
    pFront?: string;
    pBack?: string;
  }
  let { front = '', back, showCardBack, pFront, pBack }: Props = $props();

  const frontDivCls = 'absolute inset-0 bg-custom-red text-white flex justify-center items-center';
  const pClass = 'text-5xl p-8';
  let frontPCls = twMerge(pClass, pFront);
  let backPCls = twMerge(pClass, pBack);

  function limitCharacters(content: string, limit: number) {
    return content.length > limit ? content.slice(0, limit) + '...' : content;
  }
</script>

<div class="relative h-full">
  <div class={frontDivCls}>
    <p class={frontPCls}>{@html limitCharacters(front, 200)}</p>
  </div>
  <div
    class="bg-custom-blue absolute inset-0 flex items-center justify-center text-white opacity-0 {showCardBack
      ? 'opacity-100 [transform:rotateY(180deg)]'
      : ''}"
  >
    <p class={backPCls}>{@html back}</p>
  </div>
</div>
