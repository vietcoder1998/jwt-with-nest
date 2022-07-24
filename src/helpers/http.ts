import { HttpStatus } from '@nestjs/common';

export const Http = {
  responseError: function (msg, errorCode?: HttpStatus) {
    return { success: false, error: { message: msg, code: errorCode } };
  },
  responseMessage: function (msg) {
    return { data: { message: msg }, success: true };
  },
  responseData: function (data, total = 0, offset = 0, limit = 0) {
    return {
      data: data,
      pagination: { total: total, offset: offset, limit: limit },
      success: true,
    };
  },
  responseObject: function (item) {
    return { data: item, success: true };
  },
};
