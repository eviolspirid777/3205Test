import express, { Express, RequestHandler } from 'express';
import prisma from './prisma';

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.post("/shorten", async (req, res) => {
  try {
    const {
      originalUrl,
      expiresAt,
      alias,
    } = req.body;

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
});

const infoHandler: RequestHandler = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
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
    const shortUrl = req.params.shortUrl;
    
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
    const shortUrl = req.params.shortUrl;
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
      lastIps: url.analytics.map(analytic => analytic.ipAddress),
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
    const shortUrl = req.params.shortUrl;
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

app.get('/info/:shortUrl', infoHandler);
app.delete('/delete/:shortUrl', deleteHandler);
app.get('/analytics/:shortUrl', analyticsHandler);
app.get('/:shortUrl', shortUrlHandler);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
}); 