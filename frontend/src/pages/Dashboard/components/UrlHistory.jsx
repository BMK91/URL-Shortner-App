import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PublicIcon from "@mui/icons-material/Public";

import { useSnackbar } from "@components/SnackbarProvider";
import {
  getOriginalUrlService,
  getUrlHistoryService,
} from "../DashboardService";

const COPY_TOOLTIP_TITLE = "Copy original URL";

const UrlHistory = forwardRef((props, ref) => {
  const { showSnackbar } = useSnackbar();

  const [histories, setHistories] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState({});

  useImperativeHandle(ref, () => ({
    initHistoryFn,
  }));

  useEffect(() => {
    console.log("called ");
    initHistoryFn();
  }, []);

  async function initHistoryFn() {
    try {
      const payload = {};
      const response = await getUrlHistoryService(payload);

      if (response.data?.status === "SUCCESS") {
        setHistories(response.data.data);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      showSnackbar(message, "error");
    }
  }

  const copyOriginalUrl = async (data) => {
    try {
      const payload = {
        shortenUrl: data.shortenUrl,
      };
      const response = await getOriginalUrlService(payload);

      if (response.data?.status === "SUCCESS") {
        await navigator.clipboard.writeText(response.data?.data.originalUrl);
        setCopiedUrl((prev) => ({
          ...prev,
          [data._id]: true,
        }));

        setTimeout(() => {
          setCopiedUrl((prev) => {
            const { [data._id]: _, ...rest } = prev;
            return rest;
          });
        }, 1000);
        return;
      }

      showSnackbar("Copy failed!", "error");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      showSnackbar(message, "error");
    }
  };

  const handleVisitUrl = async (data) => {
    try {
      const payload = {
        shortenUrl: data.shortenUrl,
      };
      const response = await getOriginalUrlService(payload);

      if (response.data?.status === "SUCCESS") {
        window.open(
          response.data.data.originalUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      showSnackbar(message, "error");
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>URL Name</TableCell>
              <TableCell>Shortened URL</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {histories.map((history) => (
              <TableRow key={history._id}>
                <TableCell>{history.urlName}</TableCell>
                <TableCell>
                  <Box
                    display="flex"
                    alignItems="center"
                    justify-content="space-between"
                  >
                    <Tooltip
                      title={
                        copiedUrl[history._id] ? "Copied!" : COPY_TOOLTIP_TITLE
                      }
                    >
                      <IconButton
                        size="small"
                        component="button"
                        onClick={() => copyOriginalUrl(history)}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Visit URL">
                      <IconButton
                        size="small"
                        component="a"
                        onClick={() => handleVisitUrl(history)}
                      >
                        <PublicIcon />
                      </IconButton>
                    </Tooltip>

                    <span>{history.shortenUrl}</span>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
});

export default UrlHistory;
