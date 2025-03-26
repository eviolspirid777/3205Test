import { FC, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Descriptions, Modal } from "antd"
import { apiClient } from "../../../../api/apiClient"
import { GetAnalyticResponse } from "../../../../types/ApiClientTypes"

import styles from "./AnalyticsModal.module.scss"

type AnalyticsModalType = {
  shortUrl: string | undefined,
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
        if(shortUrl) {
          const response = await apiClient.getAnalytics(shortUrl);
          setAnalytics(response.data)
        }
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
          title={`Короткий url - ${shortUrl}`}
          className={styles["descriptions-block"]}
        >
          <Descriptions.Item
            label="Число переходов"
          >
            {analytics?.clickCount}
          </Descriptions.Item>
          <Descriptions.Item
            className={styles["descriptions-block-ip-addresses-block"]}
          >
            {
              analytics?.lastIps.map((ip, index) => 
                <Descriptions.Item
                  className={styles["descriptions-block-ip-addresses-block-item"]}
                  label={index}
                >
                  {ip}
                </Descriptions.Item>
              )
            }
          </Descriptions.Item>
        </Descriptions>
      </Modal>,
      document.body
    )
  )
}