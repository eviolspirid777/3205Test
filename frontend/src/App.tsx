import { Tabs, TabsProps } from 'antd';
import { MirrorForm } from './Components/Tabs/MirrorForm/MirrorForm';
import { MirrorTable } from './Components/Tabs/MirrorTable/MirrorTable';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Добавление зеркала',
    children: <MirrorForm />,
  },
  {
    key: '2',
    label: 'Таблица зеркал',
    children: <MirrorTable />,
  }
];

export const App = () => {
  return (
    <Tabs
      items={items}
    />
  )
}
