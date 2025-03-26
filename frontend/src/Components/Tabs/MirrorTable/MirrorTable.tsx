import { Button, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import { getUrlsType } from "../../../../types/ApiClientTypes";
import { apiClient, BASE_URL_PATH } from "../../../../api/apiClient";
import moment from "moment";
import { AnalyticsModal } from "../../Modal/Analytics/AnalyticsModal";

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

export const MirrorTable = () => {
  const [urls, setUrls] = useState<getUrlsType>();
  const [pagePaggination, setPagePaggination] = useState<PagePaggination>({
    page: 1,
    limit: 10
  });

  const [open, setOpen] = useState(false);
  const [shortUrl, setShortUrl] = useState<string>();

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

  const handleRowClick = (record: DataType) => {
    setShortUrl(record.shortUrl);
    setOpen(true);
  };

  const handleRedirect = async (shortUrl: string) => {
    window.location.href = `${BASE_URL_PATH}/${shortUrl}`;
  };

  const handleStraightLink = (address: string) => { 
    window.open(`https://${address}`, '_blank');
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Зеркало',
      dataIndex: 'shortUrl',
      key: 'shortUrl',
      render: (value: string, record: DataType) => (
        <Button type="link" onClick={() => handleRedirect(record.shortUrl)}>
          {value}
        </Button>
      )
    },
    {
      title: 'Полный адрес',
      dataIndex: 'originalUrl',
      key: 'originalUrl',
      render: (value: string) => (
        <Button type="link" onClick={() => handleStraightLink(value)}>
          {value}
        </Button>
      )
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
    {
      title: "",
      dataIndex: "button",
      key: "button",
      render: (_, record) => (
        <Button onClick={() => handleRowClick(record)}>
          Аналитика
        </Button>
      )
    }
  ];

  return (
    <>
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
      <AnalyticsModal
        open={open}
        setOpen={() => setOpen(false)}
        shortUrl={shortUrl}
      />
    </>
  )
}