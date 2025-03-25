import { Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import { getUrlsType } from "../../../../types/ApiClientTypes";
import { apiClient } from "../../../../api/apiClient";
import moment from "moment";

interface DataType {
  key: number;
  shortUrl: string;
  originalUrl: string;
  alias: string;
  expiresAt: moment.Moment;
}

type PagePaggination = {
  limit: number,
  page: number
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Зеркало',
    dataIndex: 'shortUrl',
    key: 'shortUrl',
  },
  {
    title: 'Полный адрес',
    dataIndex: 'originalUrl',
    key: 'originalUrl',
  },
  {
    title: 'Псевдоним',
    dataIndex: 'alias',
    key: 'alias',
  },
  {
    title: 'Истекает',
    dataIndex: 'expiresAt',
    key: 'expiresAt',
    render: (value: string) => moment(value, "YYYY-MM-DD HH:mm:ss").isValid()
            ? moment(value, "YYYY-MM-DD HH:mm:ss").fromNow()
            : value,
  },
];

export const MirrorTable = () => {
  const [ urls, setUrls ] = useState<getUrlsType>();
  const [ pagePaggination, setPagePaggination ] = useState<PagePaggination>({
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await apiClient.getUrls(pagePaggination.limit, pagePaggination.page);
        setUrls(data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    getData();
  }, [pagePaggination.page, pagePaggination.limit])

  const handlePageChange = (page: number, pageSize: number) => {
    setPagePaggination((prev) => ({
      ...prev,
      page,
      limit: pageSize,
    }));
  };

  return (
    <Table
      columns={columns}
      dataSource={urls?.data}
      pagination={{
        current: pagePaggination.page,
        pageSize: pagePaggination.limit,
        total: urls?.total,
        onChange: handlePageChange,
      }}
      rowKey={(record) => record.key.toString()}
    />
  )
}