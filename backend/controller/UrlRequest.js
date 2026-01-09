import { customAlphabet } from "nanoid";
import { z } from "zod";

import { UrlConfig } from "../models/Config.js";
import { UrlRequest } from "../models/UrlRequest.js";

const urlSchemas = z.object({
  urlName: z
    .string()
    .refine((val) => val === "" || val.length >= 3, {
      message: "Must be at least 3 characters long",
    }),
  originalUrl: z.string().refine(
    (val) => {
      try {
        const url = new URL(val);
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    },
    { message: "Enter a valid URL" }
  ),
});

const createUrlRequest = async (req, res) => {
  // Implementation for creating a URL request
  try {
    const { urlName = "", originalUrl } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Validate input data
    const validation = urlSchemas.safeParse({ urlName, originalUrl });
    if (!validation.success) {
      return res.status(400).json();
    }

    const config = await UrlConfig.findOne({
      isActive: true,
      isDeleted: false,
    });

    if (!config) {
      return resHandler(res, 500, "", API_ERRORS.URL_ALREADY_EXISTS);
    }

    const base36Timestamp = Date.now().toString(36);
    const urlCode =
      base36Timestamp +
      customAlphabet(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        config.urlLength
      )();

    const isExistUrlRequest = await UrlRequest.findOne({
      $or: [{ urlCode }, { originalUrl }],
    });

    if (isExistUrlRequest) {
      return res.status(409).json({
        message: "Original URL | URL Code Already Exists",
      });
    }

    const shortenUrl = `${config.prefix}/${urlCode}`;

    // Create a new URL request document
    const newUrlRequest = new UrlRequest({
      urlName,
      originalUrl,
      shortenUrl,
      urlCode,
      ipAddress,
    });

    await newUrlRequest.save();
    delete newUrlRequest._doc.ipAddress;

    return res.status(201).json({
      status: "SUCCESS",
      message: "URL shortened successfully",
      data: null,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOriginalUrl = async (req, res) => {
  // Implementation for getting a URL request
  try {
    const { shortenUrl } = req.body;

    const config = await UrlConfig.findOne({
      isActive: true,
      isDeleted: false,
    });

    if (!config) {
      return res.status(500).json({ message: "URL Config Not Found" });
    }

    const urlCode = shortenUrl.replace(`${config.prefix}/`, "");
    const urlRequest = await UrlRequest.findOne(
      { urlCode },
      { _id: 0, originalUrl: 1 }
    );

    if (!urlRequest) {
      return res.status(404).json({ message: "URL Request Not Found" });
    }

    // res.redirect(urlRequest.originalUrl);
    return res.json({
      status: "SUCCESS",
      message: "",
      data: urlRequest,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUrlHistory = async (req, res) => {
  try {
    const urlRequests = await UrlRequest.find(
      {
        isActive: true,
        isDeleted: false,
      },
      {
        urlName: 1,
        shortenUrl: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "SUCCESS",
      message: "",
      data: urlRequests,
    });
  } catch (error) {
    console.log(error);
  }
};

export { createUrlRequest, getOriginalUrl, getUrlHistory };
