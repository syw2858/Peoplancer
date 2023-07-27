import React from "react"
import { Navigate } from "react-router-dom"
import { Link } from "react-router-dom"
const Loginselect = () => {
    return (
        <div>
            <form>
            <center>
            <table border="0" width="700px" align="center">
            <tr align= 'center' style={{fontSize :'20px'}}>
                PEOPLANCER에 오신 것을 환영합니다!
            </tr>
            <p></p>
            <tr align= 'center' style={{fontSize :'20px'}}>
                어떤 서비스를 이용하고 싶으신가요?
            </tr>
            <p>&nbsp;&nbsp;</p>
            <p>&nbsp;&nbsp;</p>
            <hr/>
            <center>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div id="client">
                        <Link to="/Registerform_1">
                            <img src="/images/client.PNG" width="300" alt="클라이언트" />
                        </Link>
                        <p>&nbsp;&nbsp;</p>
                        <h2>클라이언트</h2>
                    </div>
                    <h>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h>
                    <div id="freelancer">
                        <Link to="/Registerform_2">
                            <img src="/images/freelancer2.png" width="300" alt="프리랜서" />
                        </Link>
                        <p>&nbsp;</p>
                        <h2>프리랜서</h2>
                    </div>
                </div>
            </center>
            </table>
            </center>
            </form>
        </div>

    );
};

export default Loginselect;
