import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  message,
  Spin,
  Upload,
  Modal,
  Radio,
  Tooltip,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import PhoneInput, { formatPhoneNumberIntl } from 'react-phone-number-input';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import 'react-phone-number-input/style.css';
import './addUser.scss';
import '../../Styles/app.scss';
import '../Common/common.form.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ExperimentOutlined,
  EyeOutlined,
  PlusOutlined,
  SafetyOutlined,
  StarOutlined,
  ToolOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/lib/upload';

const { Option } = Select;

const AddUser = () => {
  const { post, put } = useConnection();
  const [formOne] = Form.useForm();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [contactNoInput, setContactNoInput] = useState<any>();
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onSubmitData = async (values: any) => {
    setLoading(true);
    console.log({ ...values });
    try {
      values.phoneNo = formatPhoneNumberIntl(values.phoneNo);
      const response = await post('national/user/add', values);
      if (response.status === 200 || response.status === 201) {
        message.open({
          type: 'success',
          content: 'User added Successfully!',
          duration: 3,
          style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
        });
        navigate('/userManagement/viewAll', { replace: true });
        setLoading(false);
      }
    } catch (error: any) {
      console.log('Error in user creation', error);
      message.open({
        type: 'error',
        content: `Error in adding user! ${error.message}`,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
    } finally {
      setLoading(false);
      // navigate('/userManagement/viewAll', { replace: true });
    }
  };

  const onUpdateUser = async () => {
    setLoading(true);
    // values.id = state.record.id;
    const formOneValues = formOne.getFieldsValue();
    formOneValues.phoneNo = formatPhoneNumberIntl(formOneValues.phoneNo);
    try {
      const values = {
        id: state?.record?.id,
        name: formOneValues?.name,
        phoneNo: formOneValues?.phoneNo,
      };
      console.log('form one values   -- > ', values, state.record);
      const response = await put('national/user/update', values);
      if (response.status === 200 || response.status === 201) {
        message.open({
          type: 'success',
          content: 'User Updated Successfully!',
          duration: 3,
          style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
        });
        navigate('/userManagement/viewAll', { replace: true });
        state.record = {};
        setLoading(false);
      }
    } catch (error: any) {
      console.log('Error in user update', error);
      message.open({
        type: 'error',
        content: `Error in updating user! ${error.message}`,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('state -- val --- ', { ...state });
  }, []);

  return (
    <div className="add-user-main-container">
      <div className="title-container">
        <div className="main">{state?.record?.name ? 'Edit User' : 'Add New User'}</div>
        <div className="sub">
          {state?.record?.name
            ? 'Edit the users of your organisation'
            : 'Add new users to the Carbon Registry for your organisation'}
        </div>
      </div>
      <div className="content-card user-content-card">
        <Form
          name="user-details"
          className="user-details-form"
          layout="vertical"
          form={formOne}
          requiredMark={true}
          onFinish={onSubmitData}
        >
          <Row className="row" gutter={[16, 16]}>
            <Col xl={12} md={24}>
              <div className="details-part-one">
                <Form.Item
                  label="Name"
                  initialValue={state?.record?.name}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: '',
                    },
                    {
                      validator: async (rule, value) => {
                        if (
                          String(value).trim() === '' ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error('Name is required!');
                        }
                      },
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  initialValue={state?.record?.email}
                  rules={[
                    {
                      required: true,
                      message: '',
                    },
                    {
                      validator: async (rule, value) => {
                        if (
                          String(value).trim() === '' ||
                          String(value).trim() === undefined ||
                          value === null ||
                          value === undefined
                        ) {
                          throw new Error('Email is required!');
                        } else {
                          const val = value.trim();
                          const reg =
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                          const matches = val.match(reg) ? val.match(reg) : [];
                          if (matches.length === 0) {
                            throw new Error('Email is invalid!');
                          }
                        }
                      },
                    },
                  ]}
                >
                  <Input disabled={state?.record?.email} size="large" />
                </Form.Item>
              </div>
            </Col>
            <Col xl={12} md={24}>
              <div className="details-part-two">
                <Form.Item
                  className="role-group"
                  label="Role"
                  initialValue={state?.record?.role}
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: 'Role is required!',
                    },
                  ]}
                >
                  <Radio.Group
                    value={state?.record?.role}
                    size="large"
                    disabled={state?.record?.role}
                  >
                    <div className="admin-radio-container">
                      <Tooltip placement="top" title="Full access to all permitted functions">
                        <Radio.Button className="admin" value="Admin">
                          <StarOutlined className="role-icons" />
                          Admin
                        </Radio.Button>
                      </Tooltip>
                    </div>
                    <div className="manager-radio-container">
                      <Tooltip
                        placement="top"
                        title="Access to all permitted functions except user management"
                      >
                        <Radio.Button className="manager" value="Manager">
                          <ToolOutlined className="role-icons" />
                          Manager
                        </Radio.Button>
                      </Tooltip>
                    </div>
                    <div className="view-only-radio-container">
                      <Tooltip
                        placement="top"
                        title="Read-only access to all permitted functionalities"
                      >
                        <Radio.Button className="view-only" value="ViewOnly">
                          <EyeOutlined className="role-icons" />
                          Viewer
                        </Radio.Button>
                      </Tooltip>
                    </div>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="phoneNo"
                  label="Phone Number"
                  initialValue={state?.record?.phoneNo}
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <PhoneInput
                    placeholder="Phone number"
                    international
                    // value={contactNoInput}
                    defaultCountry="LK"
                    countryCallingCodeEditable={false}
                    onChange={(v) => {}}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="actions">
            <Form.Item>
              <div className="create-user-btn-container">
                {state?.record ? (
                  <Button type="primary" onClick={onUpdateUser} loading={loading}>
                    UPDATE
                  </Button>
                ) : (
                  <Button type="primary" htmlType="submit" loading={loading}>
                    SUBMIT
                  </Button>
                )}
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddUser;
