import express, { Express, RequestHandler } from 'express';
import prisma from './prisma';
import moment from 'moment';
import cors from "cors";
import type { UrlModelType } from "./types/DbModels";

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:80",
  methods: ["GET", "POST", "DELETE"],
}));

type ShortenRequestBody = {
  originalUrl: string,
  expiresAt: Date,
  alias: string
}

const handlePostUrl: RequestHandler = async (req, res) => {
  try {
    const {
      originalUrl,
      expiresAt,
      alias,
    } = req.body as ShortenRequestBody;

    if (!originalUrl) {
      return res
              .status(400)
              .json({
                message: "URL обязателен"
              });
    }

    if (expiresAt && new Date(expiresAt) < new Date()) {
      return res
              .status(400)
              .json({
                message: "Дата истечения не может быть в прошлом"
              });
    }

    if (alias) {
      const existingUrl = await prisma.url.findUnique({
        where: { alias },
      });

      if (existingUrl) {
        return res
                .status(400)
                .json({
                  message: "Этот алиас уже занят"
                });
      }
    }

    const shortUrl = Math
                      .random()
                      .toString(36)
                      .substring(2, 8);
    const url = await prisma.url.create({
      data: {
        shortUrl,
        originalUrl,
        alias,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.json({ shortUrl: url.shortUrl });
  } catch (error) {
    res
      .status(500)
      .json({
        message: (error as Error).message
      });
  }
}

const infoHandler: RequestHandler = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl as string;
    const url = await prisma.url.findUnique({
      where: { shortUrl },
      select: {
        originalUrl: true,
        createdAt: true,
        clickCount: true,
      },
    });

    if (!url) {
      return res
              .status(404)
              .json({
                message: "URL не найден"
              });
    }

    res.json(url);
  } catch (error) {
    res
      .status(500)
      .json({
        message: (error as Error).message
      });
  }
};

const deleteHandler: RequestHandler = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl as string;
    
    const url = await prisma.url.findUnique({
      where: { shortUrl },
    });

    if (!url) {
      return res
              .status(404)
              .json({
                message: "URL не найден"
              });
    }

    await prisma.$transaction([
      prisma.analytics.deleteMany({
        where: { urlId: url.id },
      }),
      prisma.url.delete({
        where: { shortUrl },
      }),
    ]);

    res.json({ message: "URL удален" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: (error as Error).message
      });
  }
};

const analyticsHandler: RequestHandler = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl as string;
    const url = await prisma.url.findUnique({
      where: { shortUrl },
      include: {
        analytics: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!url) {
      return res
              .status(404)
              .json({
                message: "URL не найден"
              });
    }

    res.json({
      clickCount: url.clickCount,
      lastIps: url.analytics.map((analytic: any) => analytic.ipAddress),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: (error as Error).message
      });
  }
};

const shortUrlHandler: RequestHandler = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl as string;
    const url = await prisma.url.findUnique({
      where: { shortUrl },
    });

    if (!url) {
      return res
              .status(404)
              .json({
                message: "URL не найден"
              });
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      return res
              .status(410)
              .json({
                message: "Срок действия ссылки истек"
              });
    }

    await prisma.$transaction([
      prisma.url.update({
        where: { shortUrl },
        data: { clickCount: { increment: 1 } },
      }),
      prisma.analytics.create({
        data: {
          urlId: url.id,
          ipAddress: req.ip ?? "",
        },
      }),
    ]);

    res.redirect(url.originalUrl);
  } catch (error) {
    res
      .status(500)
      .json({
        message: (error as Error).message
      });
  }
};

const shortUrlsHandler: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    const skip = (page - 1) * limit;

    const total = await prisma.url.count();

    const urls: UrlModelType[]  = await prisma.url.findMany({
      select: {
        id: true,
        shortUrl: true,
        originalUrl: true,
        alias: true,
        expiresAt: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedData = urls.map((url) => ({
      key: url.id,
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      alias: url.alias || "-",
      expiresAt: url.expiresAt
        ? moment(url.expiresAt).format("YYYY-MM-DD HH:mm:ss")
        : "Нет срока истечения",
    }));

    res.json({
      total,
      data: formattedData,
    });
  } catch (error) {
    console.error("Ошибка при получении списка URL:", error);
    res.status(500).json({
      message: (error as Error).message,
    });
  }
}

app.post("/shorten", handlePostUrl);
app.get('/info/:shortUrl', infoHandler);
app.delete('/delete/:shortUrl', deleteHandler);
app.get('/analytics/:shortUrl', analyticsHandler);
app.get('/:shortUrl', shortUrlHandler);
app.get("/urls", shortUrlsHandler);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
}); 