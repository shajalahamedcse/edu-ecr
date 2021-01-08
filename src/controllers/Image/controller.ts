import { Request, Response, Express } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'

import BuildResponse from 'modules/Response/BuildResponse'
import ImageService from 'controllers/Image/service'
import path from 'path'

import { ImageAttributes } from 'models/image'

import multer from 'multer'

interface MyFile extends Express.Multer.File {
  path: string
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads')
  },

  filename(req: any, file: any, cb: any) {
    cb(null, `${new Date().getTime()}_${file.originalname}`)
  },
})

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true)
  } else {
    cb(new Error('Image type not supported'))
  }
}

const upload = multer({ storage, fileFilter })

routes.get(
  '/image',
  [Authorization],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await ImageService.getAll(req)
    const buildResponse = BuildResponse.get({
      message,
      data,
      total,
    })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/deletedImage',
  [Authorization],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await ImageService.getAllDeleted(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/restoreImage/:id',
  [Authorization],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()

    await ImageService.restoreImage(id)

    const buildResponse = BuildResponse.restored({})

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/image/:id',
  // [Authorization],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    return res.sendFile(path.join(__dirname, `../../../uploads/${id}`))

    // const data = await ImageService.getOne(id)
    // const buildResponse = BuildResponse.get({ data })

    // return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/image',
  upload.array('images', 5),
  [Authorization],
  asyncHandler(async function createData(req: Request, res: Response) {
    const formData = req.getBody()
    const files = req.files as MyFile[]

    // return res.status(200).json(files)

    const imageLength: any = files.length

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < imageLength; i++) {
      let description: string[] = []
      if (formData.description) {
        description = JSON.parse(formData.description)
      }

      // eslint-disable-next-line no-plusplus
      // for (let j = 0; j < description.length; j++) {
      const imageData: ImageAttributes = {
        url: files[i].path,
        description: description[i] || '',
        questionId: formData.questionId,
        answerId: formData.answerId,
        choiceId: formData.choiceId,
        studyMaterialId: formData.studyMaterialId,
      }
      // eslint-disable-next-line no-await-in-loop
      const data = await ImageService.create(imageData)
      // }
    }

    const buildResponse = BuildResponse.created({})
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/image/:id',
  [Authorization],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await ImageService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/imagePermanent/:id',
  [Authorization],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await ImageService.delete(id, true)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/image/:id',
  [Authorization],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await ImageService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
