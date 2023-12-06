<script setup lang="ts">
import {
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTrigger,
} from '../index'
</script>

<template>
  <DrawerRoot should-scale-background>
    <DrawerTrigger as-child>
      <button data-testid="trigger" class="text-2xl">
        Open Drawer
      </button>
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay data-testid="overlay" class="fixed inset-0 bg-black/40" />
      <DrawerContent
        data-testid="content"
        class="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0"
      >
        <div class="p-4 bg-white rounded-t-[10px] flex-1">
          <div class="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
          <div class="max-w-md mx-auto">
            <h1 class="font-medium mb-4">
              Unstyled drawer for Vue2.
            </h1>
            <p class="text-zinc-600 mb-2">
              This component can be used as a replacement for a Dialog on mobile and tablet devices.
            </p>
            <p class="text-zinc-600 mb-8">
              It uses
              Radix&apos;s Dialog primitive
              under the hood
            </p>
          </div>
        </div>
        <div class="p-4 bg-zinc-100 border-t border-zinc-200 mt-auto">
          <div class="flex gap-6 justify-end max-w-md mx-auto">
            <a
              class="text-xs text-zinc-600 flex items-center gap-0.25"
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
</template>

<style>
</style>
