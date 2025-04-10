import AnalysisAssessment from "./AnalysisAssessment"
import { User } from "next-auth";
import { useEffect, useState, useRef } from "react";
import { Document, Page, Text, View, Image, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { Venture } from "@/types/venture.type";
import html2canvas from "html2canvas";
import Spinner from "@/components/Spinner";

interface RiskAssessmentDocProps {
    venture: Venture | undefined;
}

interface BubbleData {
    x: number;
    y: number;
    z: number;
    color: string;
    svg_color: string;
}

const RiskAssessmentDoc = ({ venture }: RiskAssessmentDocProps) => {

    const [coMentees, setCoMentees] = useState<User[]>([]);
    const [coMentors, setCoMentors] = useState<User[]>([]);
    const refs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<string[]>([]);
    const [isRendered, setIsRendered] = useState(false);
    const [isFullRendered, setIsFullRendered] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    const alreadyAssessed = (_id: string) => {
        if (venture && venture.assessments != null && venture.assessments != undefined) {
            return venture.assessments.some(item => item._id.toString() === _id.toString());
        }
        return false;
    }

    const getMentorInfo = (_id: string) => {
        if (venture && venture.mentors != null && venture.mentors != undefined) {
            for (const item of venture.mentors) {
                if (item._id.toString() === _id.toString()) {
                    return { name: item.name, img: item.image }; // Return the name once found
                }
            }
        }

        return { name: "", img: "" }; // Return "Unknown" if mentor with _id is not found
    }

    const getChartData = (_id: string) => {
        let tempData: BubbleData[] = [
            { x: 0, y: 0, z: 0, color: 'rgba(72, 106, 217, 0.6)', svg_color: 'rgb(72, 106, 217)' },
            { x: 0, y: 0, z: 0, color: 'rgba(90, 35, 145, 0.6)', svg_color: 'rgb(90, 35, 145)' },
            { x: 0, y: 0, z: 0, color: 'rgba(84, 187, 189, 0.6)', svg_color: 'rgb(84, 187, 189)' },
            { x: 0, y: 0, z: 0, color: 'rgba(234, 59, 247, 0.6)', svg_color: 'rgb(234, 59, 247)' },
        ];
        let depthData = [{ sum: 0, cnt: 0 }, { sum: 0, cnt: 0 }, { sum: 0, cnt: 0 }, { sum: 0, cnt: 0 }];
        if (venture && venture.assessments != null && venture.assessments != undefined) {
            for (const item of venture.assessments) {
                if (item._id.toString() === _id.toString()) {
                    tempData[0].x = item.value[0] * 10;
                    tempData[1].x = item.value[1] * 10;
                    tempData[2].x = item.value[2] * 10;
                    tempData[3].x = item.value[3] * 10;
                    tempData[0].z = item?.articulates[0] * 14;
                    tempData[1].z = item?.articulates[1] * 14;
                    tempData[2].z = item?.articulates[2] * 14;
                    tempData[3].z = item?.articulates[3] * 14;
                    if (venture.course && venture.course.modules != null && venture.course.modules != undefined) {
                        for (const unit of venture.course.modules) {
                            if (unit.evaluations && unit.evaluations != null && unit.evaluations != undefined) {
                                if (unit.module.item == "Problem") {
                                    for (const unit2 of unit.evaluations) {
                                        if (unit2._id.toString() === _id.toString()) {
                                            depthData[0].sum += Number(unit2.value);
                                            depthData[0].cnt += 1;
                                        }
                                    }
                                } else if (unit.module.item === "Character") {
                                    for (const unit2 of unit.evaluations) {
                                        if (unit2._id.toString() === _id.toString()) {
                                            depthData[1].sum += Number(unit2.value);
                                            depthData[1].cnt += 1;
                                        }
                                    }
                                } else if (unit.module.item === "Setting") {
                                    for (const unit2 of unit.evaluations) {
                                        if (unit2._id.toString() === _id.toString()) {
                                            depthData[2].sum += Number(unit2.value);
                                            depthData[2].cnt += 1;
                                        }
                                    }
                                } else if (unit.module.item === "Solution") {
                                    for (const unit2 of unit.evaluations) {
                                        if (unit2._id.toString() === _id.toString()) {
                                            depthData[3].sum += Number(unit2.value);
                                            depthData[3].cnt += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (let i = 0; i < depthData.length; i++) {
                if (depthData[i].cnt !== 0)
                    tempData[i].y = (depthData[i].sum / depthData[i].cnt) * 9;
            }
            return tempData;
        }
    }

    const getCollaborators = async () => {
        const url = `/api/collaboration/${venture?.collabId.toString()}-${venture?._id}`;

        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            const { err } = await response.json();
            console.log(err);
        } else {
            const { collaboration } = await response.json();
            setCoMentees(collaboration.mentees);
            setCoMentors(collaboration.mentors);

        }
    }

    const captureImages = async () => {
      const capturedImages: string[] = [];
      for (let i = 0; i < refs.current.length; i++) {
        const element = refs.current[i];
        if (element) {
          try {
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL('image/png');
            capturedImages.push(imgData);
          } catch (error) {
            console.error(`Failed to capture element ${i}:`, error);
          }
        }
      }
      setIsFullRendered(true);
      setImages(capturedImages);
    };

    useEffect(() => {
        if (venture) {
            getCollaborators();
        }
    }, [venture]);

    useEffect(() => {
        if (isRendered) {
            captureImages();
        }
    }, [isRendered]);

    useEffect(() => {
        setIsRendered(true);
    }, []);

    
    const styles = StyleSheet.create({
      body: {
        paddingTop: 45,
        paddingBottom: 65,
        paddingHorizontal: 35,
      },
      title: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      author: {
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 10,
      },
      subtitle: {
        fontSize: 18,
        marginHorizontal: 12,
        marginTop: 20,
        fontWeight: 'bold',
      },
      text: {
        marginHorizontal: 12,
        marginTop: 4,
        fontSize: 14,
        textAlign: 'justify',
      },
      textBold: {
        marginHorizontal: 12,
        marginTop: 4,
        fontSize: 14,
        textAlign: 'justify',
        fontWeight: 'bold',
      },
      image: {
        marginHorizontal: 12,
        marginVertical: 15,
      },
      header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
      },
      pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
      },
    });

    return (
      <div className="relative">
        {
          isFullRendered ?       <PDFViewer style={{ width: '100%', height: '80vh' }}>
          <Document>
            <Page style={styles.body}>
              <Text style={styles.title}>{venture?.title}</Text>
              <Text style={styles.author}>Reported from: {formatDate(new Date().toDateString())}</Text>
              <Text style={styles.subtitle}>
                Venture Team:
              </Text>
              {coMentees.map((item: User, index: number) => {
                return (
                    <Text key={index} style={styles.text}>
                         {item.name}
                    </Text>
                )
              })}
              <Text style={styles.subtitle}>
                Mentors:
              </Text>
              {coMentors.map((item: any, index: number) => {
                return (
                    <Text key={index} style={styles.text}>
                         {item.name}{alreadyAssessed(item?._id) && <Text>*</Text>}
                    </Text>
                )
              })}
              <Text style={styles.text}>* Indicates completion of risk assessment</Text>
              <Text style={styles.subtitle}>Elevator Pitch</Text>
                {
                    venture?.storyTrain ?
                        <>
                            {
                                venture.storyTrain.map((item: any, index: number) => {
                                    return (
                                        <>
                                            <Text style={styles.textBold}>{item.label}</Text>
                                            <Text style={styles.text}>{item.value == "" ? "N/A" : item.value}</Text>
                                        </>
                                    )
                                })
                            }
                        </> :
                        <Text style={styles.text}>N/A</Text>
                }
              <Text style={styles.subtitle}>Individual Mentor Assessments</Text>
              {images.map((imgSrc, index) => (
                <View key={index}>
                  <Image src={imgSrc} style={styles.image} />
                </View>
              ))}
              <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
              )} fixed />
            </Page>
          </Document>
        </PDFViewer> :
        <Spinner />
        }

    <div ref={containerRef} className="absolute z-[-1] top-[-5000px]">
    {venture?.assessments && venture?.assessments.map((item, index) => {
                    return (
                        <div key={index} 
                        ref={(el) => (refs.current[index] = el)}
                        >
                            <div className="">
                                <h1 className="mb-3 text-xl font-bold">{getMentorInfo(item._id).name}:</h1>
                            </div>
                            <AnalysisAssessment chartData={getChartData(item._id)} />
                          
                        </div>
                    )
            })}
    </div>
    </div>
    )
}

export default RiskAssessmentDoc;
