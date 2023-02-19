import { Container } from 'typedi';
import express from 'express';
import cors from 'cors';
import upload from '../loaders/multer';

import statusCode from '../common/constant/statusCode';
import responseMessage from '../common/constant/responseMessage';
import cameraService from '../services/camera';

const route = express.Router();

route.use(
    cors({
        origin: true,
        credentials: true,
    }),
);
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.post('/:userId', upload.single('file'), async (req, res) => {
    const expressionDto = JSON.parse(req.body.expressionData);

    if (req.file == null) {
        return res.status(statusCode.BAD_REQUEST).json({ message: responseMessage.camera.upload_error });
    }
    const videoUrl: string = req.file['key'];
    const thumbnailUrl: string = 'card-thumbnail' + req.file['key'].split('.')[0].replace('album-video', '') + '.jpg';

    expressionDto['videoUrl'] = videoUrl;
    expressionDto['userId'] = req.params.userId;
    expressionDto['thumbnailUrl'] = thumbnailUrl;

    cameraService.postCamera(expressionDto, (err, data) => {
        if (err) res.status(statusCode.INTERNAL_SERVER_ERROR).send({ err: err, message: responseMessage.camera.expression_error });
        else res.status(statusCode.OK).send(data);
    });
});

route.get('/:userId', (req, res) => {
    cameraService.getVideo(req.params.userId, (err, data) => {
        if (err) res.status(statusCode.INTERNAL_SERVER_ERROR).send({ err: err, message: responseMessage.camera.video_error });
        else res.status(statusCode.OK).send(data);
    });
});

route.get('/usim/:userId', (req, res) => {
    cameraService.getUsim(req.params.userId, (err, data) => {
        if (err) res.status(statusCode.INTERNAL_SERVER_ERROR).send({ err: err, message: responseMessage.camera.usim_error });
        else res.status(statusCode.OK).send(data);
    });
});

export default route;
