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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PublicIcon from "@mui/icons-material/Public";

import ConfirmDeletePopup from "@components/ConfirmDeletePopup";
import { useSnackbar } from "@components/SnackbarProvider";
import { useHandleMessage } from "@hooks/handleMessage";
import {
  deleteUrlHistoryService,
  getOriginalUrlService,
  getUrlHistoryService,
} from "../DashboardService";

const COPY_TOOLTIP_TITLE = "Copy original URL";

const UrlHistory = forwardRef((props, ref) => {
  const { showSnackbar } = useSnackbar();
  const handleMessage = useHandleMessage();

  const [histories, setHistories] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState({});
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deletedIds, setDeletedIds] = useState(null);

  useImperativeHandle(ref, () => ({
    initHistoryFn,
  }));

  useEffect(() => {
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
      handleMessage(error);
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
      handleMessage(error);
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

      showSnackbar("Something went wrong!", "error");
    } catch (error) {
      handleMessage(error);
    }
  };

  const handleDelete = async (id) => {
    setDeletedIds(id || null);
    setOpenDeletePopup(!!id);
  };

  const deleteRecord = async () => {
    try {
      const response = await deleteUrlHistoryService(deletedIds);

      if (response.data?.status === "SUCCESS") {
        handleMessage(response);
        initHistoryFn();
        return;
      }

      showSnackbar("Something went wrong!", "error");
    } catch (error) {
      handleMessage(error);
    } finally {
      setOpenDeletePopup(false);
      setDeletedIds(null);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>URL Name</TableCell>
              <TableCell>Shortened URL</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {histories.map((history) => (
              <TableRow key={history._id}>
                <TableCell sx={{ width: 10 }}>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      component="button"
                      color="error"
                      onClick={() => handleDelete(history._id)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>

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

                <TableCell>{history.formattedCreatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDeletePopup
        isOpen={openDeletePopup}
        callbackFn={{
          confirm: deleteRecord,
          cancel: handleDelete,
        }}
      />
    </>
  );
});

export default UrlHistory;
