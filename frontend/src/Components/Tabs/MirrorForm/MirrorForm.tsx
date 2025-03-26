import { Button, DatePicker, Form, Input } from "antd"
import { FC } from "react";
import { apiClient } from "../../../../api/apiClient";
import moment from "moment";

import styles from "./MirrorForm.module.scss"
import { useForm } from "antd/es/form/Form";

type FormValues = {
  originalUrl: string;
  date: moment.Moment | null,
  alias: string,
};

type MirrorFormProps = {
  setIsUpdated: () => void
}

export const MirrorForm: FC<MirrorFormProps> = ({
  setIsUpdated
}) => {
  const [form] = useForm();

  const submitForm = async (values: FormValues) => {
    try {
      const { originalUrl, date, alias } = values;
  
      if (!date) {
        console.error('Дата и время не выбраны');
        return;
      }

      const combinedDateTime = date.format('YYYY-MM-DDTHH:mm:ss');

      let convertedUrl = originalUrl;
      if(!convertedUrl.includes("https://") || !convertedUrl.includes("http://")) {
        convertedUrl = `https://${convertedUrl}`
      }
      const { data } = await apiClient.postAddress({
        originalUrl: convertedUrl,
        alias,
        expiresAt: combinedDateTime,
      });

      window.alert(`Зеркало успешно создано!\nURL: ${data.shortUrl}`)
  
      setIsUpdated();
      form.resetFields();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      window.alert(error)
    }
  };

  return (
    <div
      className={styles["form-container"]}
    >
      <h1>Формирование зеркала</h1>
      <Form
        onFinish={submitForm}
        form={form}
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