<script lang="ts" setup>
import { DrawerContent, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTitle, DrawerTrigger } from 'vaul-vue2'
</script>

<template>
  <demo-section>
    <demo-block title="基础用法">
      <DrawerRoot should-scale-background>
        <DrawerTrigger as-child>
          <button data-testid="trigger" class="text-red-500">
            Open Drawer
          </button>
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay class="fixed inset-0 bg-black/40" />
          <DrawerContent
            data-testid="content"
            class="fixed flex flex-col  bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]"
          >
            <div class="p-4 bg-white rounded-t-[10px] flex-1">
              <div class="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
              <div class="max-w-md mx-auto">
                <DrawerTitle class="font-medium mb-4">
                  Unstyled drawer for React.
                </DrawerTitle>
                <p class="text-zinc-600 mb-2">
                  This component can be used as a replacement for a Dialog on mobile and tablet devices.
                </p>
                <p class="text-zinc-600 mb-8">
                  It uses' '
                  <a
                    href="https://www.radix-ui.com/docs/primitives/components/dialog"
                    class="underline"
                    target="_blank"
                  >
                    Radix&apos;s Dialog primitive
                  </a>' '
                  under the hood and is inspired by' '
                  <a
                    href="https://twitter.com/devongovett/status/1674470185783402496"
                    class="underline"
                    target="_blank"
                  >
                    this tweet.
                  </a>
                </p>
              </div>
            </div>
            <div class="p-4 bg-zinc-100 border-t border-zinc-200 mt-auto">
              <div class="flex gap-6 justify-end max-w-md mx-auto">
                <a
                  class="text-xs text-zinc-600 flex items-center gap-0.25"
                  href="https://github.com/emilkowalski/vaul"
                  target="_blank"
                >
                  GitHub
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="16"
                    aria-hidden="true"
                    class="w-3 h-3 ml-1"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14L21 3" />
                  </svg>
                </a>
                <a
                  class="text-xs text-zinc-600 flex items-center gap-0.25"
                  href="https://twitter.com/emilkowalski_"
                  target="_blank"
                >
                  Twitter
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="16"
                    aria-hidden="true"
                    class="w-3 h-3 ml-1"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </DrawerRoot>
    </demo-block>

    <demo-block title="自定义颜色" />
  </demo-section>
</template>
