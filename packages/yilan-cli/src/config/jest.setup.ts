import Vue from 'vue'
import 'jest-canvas-mock'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Package from '../../dist/package-entry'

Vue.use(Package)
