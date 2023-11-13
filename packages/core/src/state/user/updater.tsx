import { useEffect, useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import { AppDispatch, AppThunkDispatch, useAppDispatch } from "..";
import useWebSocket, { ReadyState } from "react-use-websocket";

import useActiveWagmi from "../../lib/hooks/useActiveWagmi";
import useIsWindowVisible from "../../lib/hooks/useIsWindowVisible";

import { AccountUpnl } from "../../types/user";
import { useHedgerInfo } from "../hedger/hooks";

import { updateAccountUpnl, updateMatchesDarkMode } from "./actions";
import {
  useActiveAccountAddress,
  useSetUpnlWebSocketStatus,
  useUserWhitelist,
} from "./hooks";
import { getIsWhiteList, getTotalDepositsAndWithdrawals } from "./thunks";
import { ConnectionStatus } from "./types";
import { useAppName } from "../chains/hooks";

export function UserUpdater(): null {
  const dispatch = useAppDispatch();
  const thunkDispatch: AppThunkDispatch = useAppDispatch();
  const { account, chainId } = useActiveWagmi();
  const activeAccountAddress = useActiveAccountAddress();
  const appName = useAppName();

  const { baseUrl, fetchData, clientName } = useHedgerInfo() || {};
  useUpnlWebSocket(dispatch);

  useEffect(() => {
    if (fetchData && account)
      thunkDispatch(getIsWhiteList({ baseUrl, account, clientName, appName }));
  }, [thunkDispatch, baseUrl, account, fetchData, clientName, appName]);

  useEffect(() => {
    if (chainId)
      thunkDispatch(
        getTotalDepositsAndWithdrawals({
          account: activeAccountAddress,
          chainId,
        })
      );
  }, [activeAccountAddress, chainId, thunkDispatch]);

  // keep dark mode in sync with the system
  useEffect(() => {
    const darkHandler = (match: MediaQueryListEvent) => {
      dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }));
    };

    const match = window?.matchMedia("(prefers-color-scheme: dark)");
    dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }));

    if (match?.addListener) {
      match?.addListener(darkHandler);
    } else if (match?.addEventListener) {
      match?.addEventListener("change", darkHandler);
    }

    return () => {
      if (match?.removeListener) {
        match?.removeListener(darkHandler);
      } else if (match?.removeEventListener) {
        match?.removeEventListener("change", darkHandler);
      }
    };
  }, [dispatch]);

  return null;
}

function useUpnlWebSocket(dispatch: AppDispatch) {
  const windowVisible = useIsWindowVisible();
  const activeAccountAddress = useActiveAccountAddress();
  const updateWebSocketStatus = useSetUpnlWebSocketStatus();
  const isAccountWhiteList = useUserWhitelist();
  const { webSocketUpnlUrl } = useHedgerInfo() || {};

  const url = useMemo(() => {
    if (isAccountWhiteList && webSocketUpnlUrl) {
      return webSocketUpnlUrl;
    }
    return null;
  }, [isAccountWhiteList, webSocketUpnlUrl]);

  const {
    readyState: upnlWebSocketState,
    sendMessage: sendAddress,
    lastJsonMessage: upnlWebSocketMessage,
  } = useWebSocket<{
    upnl: number;
    timestamp: number;
    available_balance: number;
  }>(url, {
    reconnectAttempts: 2,
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    shouldReconnect: () => true,
    onError: (e) => console.log("WebSocket connection has error ", e),
  });

  const connectionStatus = useMemo(() => {
    if (upnlWebSocketState === ReadyState.OPEN) {
      return ConnectionStatus.OPEN;
    } else {
      return ConnectionStatus.CLOSED;
    }
  }, [upnlWebSocketState]);

  useEffect(() => {
    updateWebSocketStatus(connectionStatus);
  }, [connectionStatus, updateWebSocketStatus]);

  useEffect(() => {
    if (upnlWebSocketState === ReadyState.OPEN && activeAccountAddress) {
      sendAddress(activeAccountAddress);
    }
  }, [upnlWebSocketState, activeAccountAddress, sendAddress, windowVisible]);

  useEffect(() => {
    try {
      if (!upnlWebSocketMessage || isEmpty(upnlWebSocketMessage)) {
        dispatch(
          updateAccountUpnl({
            upnl: 0,
            timestamp: 0,
            available_balance: 0,
          })
        );
        return;
      }

      // TODO: we should add type checking here

      const lastMessage: AccountUpnl = upnlWebSocketMessage ?? {
        upnl: 0,
        timestamp: 0,
        available_balance: 0,
      };
      dispatch(updateAccountUpnl(lastMessage));
    } catch (error) {
      dispatch(
        updateAccountUpnl({
          upnl: 0,
          timestamp: 0,
          available_balance: 0,
        })
      );
    }
  }, [dispatch, upnlWebSocketMessage, windowVisible]);
}
