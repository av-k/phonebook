import styled from 'styled-components';
import { prop } from 'styled-tools';

const Wrapper = styled.div`
  margin: 2em auto;
  width: 40px;
  height: 40px;
  position: relative;
  ${prop('style')}
`;

export default Wrapper;
