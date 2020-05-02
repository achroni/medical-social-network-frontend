import axios from "axios";
import blake from "blakejs";

import { returnErrors, createMessage } from "./messages";
import { tokenConfig } from "./user";
import {
  BLOCKCHAIN_LOADING,
  BLOCKCHAIN_LOADED,
  BLOCKCHAIN_FAIL
} from "./types";

import { getUsernamesOfMyPosts } from "./posts";

export const hashHistory = () => (dispatch, getState) => {
  dispatch({ type: BLOCKCHAIN_LOADING });

  const myPosts = getState().posts.myPosts;
  const usernames = getUsernamesOfMyPosts(myPosts);
  const transactions = [];
  return axios
    .all(
      usernames.map(acc =>
        axios.post(
          `/iroha/get_acc_tx/`,
          { account_id: acc },
          tokenConfig(getState)
        )
      )
    )
    .then(res => {
      // get Transactions successfully
      const dataArray = res.map(r => r.data);
      dataArray.forEach(data => {
        transactions.push(...data);
      });
      transactions.forEach(tx => {
        if (tx.iroha_description) {
          const hash = blake.blake2sHex(tx.iroha_description);
          tx["calculated_hash"] = hash;
        }
      });
      dispatch({
        type: BLOCKCHAIN_LOADED,
        payload: transactions
      });
    })
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: BLOCKCHAIN_FAIL
      });
    });
};
