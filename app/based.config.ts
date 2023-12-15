import { BasedFunctionConfig } from '@based/functions'

const config: BasedFunctionConfig = {
  type: 'app',
  name: 'app',
  public: true,
  main: './apps.tsx',
  path: '/',
  favicon: './favicon.ico',
}
export default config
