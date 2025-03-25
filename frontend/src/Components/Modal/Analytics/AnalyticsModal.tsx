import { FC, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Descriptions, Modal } from "antd"
import { apiClient } from "../../../../api/apiClient"
import { GetAnalyticResponse } from "../../../../types/ApiClientTypes"

// import styles from "./AnalyticsModal.module.scss"

type AnalyticsModalType = {
  shortUrl: string,
  open: boolean,
  setOpen: () => void,
}

export const AnalyticsModal: FC<AnalyticsModalType> = ({
  shortUrl,
  open,
  setOpen,
}) => {
  const [analytics, setAnalytics] = useState<GetAnalyticResponse>();

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const response = await apiClient.getAnalytics(shortUrl);
        setAnalytics(response.data)
      } catch (ex) {
        console.error(ex)
      }
    }

    getAnalytics();
  }, [shortUrl])

  return (
    createPortal(
      <Modal
        title="Аналитика"
        footer={null}
        open={open}
        onClose={setOpen}
        onCancel={setOpen}
      >
        <Descriptions
          title={shortUrl}
        >
          <Descriptions.Item
            label={analytics?.clickCount}
          >
            {analytics?.clickCount}
          </Descriptions.Item>
          {
            analytics?.lastIps.map((ip, index) => 
              <Descriptions.Item
                key={index}
                label={index}
              >
                {ip}
              </Descriptions.Item>)
          }
        </Descriptions>
      </Modal>,
      document.body
    )
  )
}