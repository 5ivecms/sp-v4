import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { readFile } from 'fs-extra'
const fs = require('fs')

@Injectable()
export class AppService {
  public getHello(): string {
    return 'Hello World!'
  }

  public async listComparison() {
    const list1 = (await readFile(`${path}/list1.txt`)).toString().split('\n') as string[]
    const list2 = (await readFile(`${path}/list2.txt`)).toString().split('\n') as string[]

    const uniqueList: string[] = []

    list1.forEach((item) => {
      if (!list2.includes(item)) {
        uniqueList.push(item)
      }
    })

    fs.writeFile(`${path}/src/unique.txt`, uniqueList.join('\n'), (err) => {
      if (err) {
        console.error(err)
        return
      }

      console.log('Строка успешно записана в файл.')
    })

    return ''
  }
}
