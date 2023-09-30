import { registerAs } from '@nestjs/config'

export type ServerConfig = {
  port: number
}

export default registerAs('server', () => ({
  port: Number(process.env.PORT || 5000),
}))
