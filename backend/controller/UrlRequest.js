import { customAlphabet } from "nanoid";
import { z } from "zod";

import API_RESPONSE from "../constants/api-responses.js";
import { UrlConfig } from "../models/Config.js";
import { UrlRequest } from "../models/UrlRequest.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";

const urlSchemas = z.object({
  urlName: z.string().min(3, {
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
      return sendError(res, API_RESPONSE.BAD_REQUEST);
    }

    const config = await UrlConfig.findOne({
      isActive: true,
      isDeleted: false,
    });

    if (!config) {
      return sendError(res, {
        ...API_RESPONSE.NOT_FOUND,
        err: "Config not found!",
      });
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
      return sendError(res, {
        ...API_RESPONSE.CONFLICT,
        message: "URL already exist!",
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

    return sendSuccess(res, {
      message: "URL shortned successfully!",
    });
  } catch (error) {
    return sendError(res);
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
    return sendError(res);
  }
};

const getUrlHistory = async (req, res) => {
  try {
    const urlRequests = await UrlRequest.aggregate([
      { $match: { isActive: true, isDeleted: false } },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          urlName: 1,
          shortenUrl: 1,
          createdAt: 1,
          formattedCreatedAt: {
            $dateToString: { format: "%d %b %Y, %H:%M", date: "$createdAt" },
          },
        },
      },
    ]);

    return res.status(200).json({
      status: "SUCCESS",
      message: "",
      data: urlRequests,
    });
  } catch (error) {
    return sendError(res);
  }
};

const deleteUrlHistory = async (req, res) => {
  try {
    const { id: _id } = req.params;

    if (!_id) {
      return sendError(res, API_RESPONSE.BAD_REQUEST);
    }

    const { deletedCount } = await UrlRequest.deleteOne({ _id });

    if (deletedCount > 0) {
      return sendSuccess(res, {
        ...API_RESPONSE.DELETED,
        data: {
          deletedCount,
        },
      });
    }

    return sendError(res, API_RESPONSE.SOMETHING_WENT_WRONG);
  } catch (error) {
    return sendError(res);
  }
};

export { createUrlRequest, deleteUrlHistory, getOriginalUrl, getUrlHistory };
