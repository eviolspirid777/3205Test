import { Button, DatePicker, Form, Input, message } from "antd"
import { useState } from "react";
import { apiClient } from "../../../../api/apiClient";
import moment from "moment";

import styles from "./MirrorForm.module.scss"

type FormValues = {
  originalUrl: string;
  date: moment.Moment | null,
  alias: string,
};

export const MirrorForm = () => {
  const [, setShortUrl] = useState<string>();

  const submitForm = async (values: FormValues) => {
    try {
      const { originalUrl, date, alias } = values;
  
      if (!date) {
        console.error('Дата и время не выбраны');
        return;
      }

      const combinedDateTime = date.format('YYYY-MM-DDTHH:mm:ss');
      
      message.success("Успешно создана короткая ссылка!")

      const { data } = await apiClient.postAddress({
        originalUrl,
        alias,
        expiresAt: combinedDateTime,
      });
  
      setShortUrl(data.shortUrl);
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
    }
  };

  return (
    <div
      className={styles["form-container"]}
    >
      <h1>Формирование зеркала</h1>
      <Form
        onFinish={submitForm}
        layout='vertical'
      >
        <Form.Item
          name="originalUrl"
          label="Полный адрес"
          rules={[{required: true, message: "Введите адрес"}]}
        >
          <Input
            placeholder="Введите адрес"
          />
        </Form.Item>
        <Form.Item
          name="alias"
          label="Псевдоним"
          rules={[{required: true, message: "Введите адрес"}]}
        >
          <Input
            placeholder="Введите псевдоним"
          />
        </Form.Item>
        <Form.Item
          name="date"
          label="Дата"
          rules={[{ required: true, message: 'Выберите дату' }]}
        >
          <DatePicker
            onChange={console.log}
            showTime={{format: "HH:mm"}}
            placeholder="Выберите дату"
          />
        </Form.Item>
        <Button
          htmlType='submit'
          type='primary'
          className={styles["submit-button"]}
        >
          Отправить
        </Button>
      </Form>
    </div>
  )
}