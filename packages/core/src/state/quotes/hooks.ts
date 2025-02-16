import { useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../declaration";
import uniqWith from "lodash/uniqWith.js";

import { Quote } from "../../types/quote";
import { ApiState } from "../../types/api";
import useActiveWagmi from "../../lib/hooks/useActiveWagmi";
import {
  addQuote,
  addQuoteToHistory,
  removeQuote,
  setHistory,
  setPendings,
  setQuoteDetail,
} from "./actions";
import { useActiveAccountAddress } from "../user/hooks";

// returns all the histories
export function useHistoryQuotes(): {
  quotes: Quote[];
  state: ApiState;
  hasMoreHistory: boolean | undefined;
} {
  const { chainId } = useActiveWagmi();
  const account = useActiveAccountAddress();
  const history = useAppSelector((state) => state.quotes.history);
  const historyState = useAppSelector((state) => state.quotes.historyState);
  const hasMoreHistory = useAppSelector((state) => state.quotes.hasMoreHistory);
  return useMemo(() => {
    const histories = chainId ? history[chainId] ?? [] : [];
    return {
      quotes: uniqWith(
        histories
          .filter(
            (h: Quote) =>
              account && h.partyA.toLowerCase() === account.toLowerCase()
          )
          .sort(
            (a: Quote, b: Quote) =>
              Number(b.modifyTimestamp) - Number(a.modifyTimestamp)
          ),
        (quoteA, quoteB) => {
          return quoteA.id === quoteB.id;
        }
      ),
      state: historyState,
      hasMoreHistory,
    };
  }, [chainId, history, historyState, hasMoreHistory, account]);
}

export function usePendingsQuotes(): { quotes: Quote[]; state: ApiState } {
  const pendings = useAppSelector((state) => state.quotes.pendings);
  return { quotes: pendings, state: ApiState.OK };
}

export function usePositionsQuotes(): { quotes: Quote[]; state: ApiState } {
  const positions = useAppSelector((state) => state.quotes.positions);
  return { quotes: positions, state: ApiState.OK };
}

export function useAllQuotes(): { quotes: Quote[]; state: ApiState } {
  const positions = useAppSelector((state) => state.quotes.positions);
  const pendings = useAppSelector((state) => state.quotes.pendings);
  const { quotes: history } = useHistoryQuotes();
  const historyState = useAppSelector((state) => state.quotes.historyState);
  return useMemo(() => {
    const allQuotes = [...pendings, ...positions, ...history];
    return {
      quotes: allQuotes.sort(
        (a: Quote, b: Quote) =>
          Number(b.modifyTimestamp) - Number(a.modifyTimestamp)
      ),
      state: historyState,
    };
  }, [history, historyState, pendings, positions]);
}

export function useQuoteDetail(): Quote | null {
  const quoteDetail = useAppSelector((state) => state.quotes.quoteDetail);
  return quoteDetail;
}

export function useListenersQuotes(): number[] {
  const listeners = useAppSelector((state) => state.quotes.listeners);
  return listeners;
}

export function useAddQuotesToListenerCallback() {
  const dispatch = useAppDispatch();
  return useCallback(
    (id: number) => {
      dispatch(addQuote({ id }));
    },
    [dispatch]
  );
}

export function useSetQuoteDetailCallback() {
  const dispatch = useAppDispatch();
  return useCallback(
    (quote: Quote | null) => {
      dispatch(setQuoteDetail({ quote }));
    },
    [dispatch]
  );
}
export function useSetHistoryCallback() {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWagmi();

  return useCallback(
    (quotes: Quote[]) => {
      if (chainId) dispatch(setHistory({ quotes, chainId }));
    },
    [dispatch, chainId]
  );
}

export function useSetPendingsCallback() {
  const dispatch = useAppDispatch();
  return useCallback(
    (quotes: Quote[]) => {
      dispatch(setPendings({ quotes }));
    },
    [dispatch]
  );
}

export function useRemoveQuotesFromListenerCallback() {
  const dispatch = useAppDispatch();
  return useCallback(
    (id: number) => {
      dispatch(removeQuote({ id }));
    },
    [dispatch]
  );
}

export function useAddQuoteToHistoryCallback() {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWagmi();
  return useCallback(
    (quote: Quote) => {
      if (chainId) dispatch(addQuoteToHistory({ quote, chainId }));
    },
    [dispatch, chainId]
  );
}

export function useGetExistedQuoteByIdsCallback() {
  const { quotes } = useAllQuotes();

  return useCallback(
    (id: string | null) => {
      if (!id) return null;

      const existedQuote = quotes.find((quote) => quote.id.toString() === id);
      if (existedQuote) return existedQuote;
      return null;
    },
    [quotes]
  );
}
