import express from 'express'
import { prisma } from '../utils/prisma/index.js'


const router = express.Router()


// 게시글 생셩 API 
router.post('/posts', async (req, res, next) => {
    //const { postId } = req.params
    const {title, content } = req.body

    const post = await prisma.posts.create({
        data: {
            title,
            content
        }
    })
    return res.status(201).json({ data: post })
})

// 게시글 상세 조회
router.get('/posts', async (req, res, next) => {
    const { postId } = req.params
    //const { title, content } = req.body
    const post = await prisma.posts.findMany({
        select: {
            postId: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return res.status(200).json({ data: post})
})
// 수정 API
router.put('/posts/:postId', async (req, res, next) => {
    const { postId } = req.params
    const { title, content } = req.body

    const post = await prisma.posts.findFirst({
        where: { postId: +postId},
    })
    const updatePost = await prisma.posts.update({
        where: { postId: +postId },
        data: { title, content }
    })
    return res.status(200).json({ message: "수정 완료" })
})

// 삭제 API
router.delete('/posts/:postId', async (req, res, next ) => {
    const { postId } = req.params
    const post = await prisma.posts.findFirst({
        where: { postId: +postId }
    })
    if(!post) {
        return res.status(401).json({errorMessage: "존재하는 게시글이 없습니다." })
    }

    await prisma.posts.delete({
        where: { postId: +postId }

    })
    return res.status(200).json({ message: "게시글이 삭제되었습니다." })
})



export default router