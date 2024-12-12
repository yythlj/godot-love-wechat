import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Shuffle, Settings, Folder } from "lucide-react";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Select } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

export interface Project {
  name: string;
  description: string;
  version: string;
  icon: string;
}

export interface ProjectCardProps extends Project {
  key: number;
}

export interface ExportSettings {
  exportPath: string;
  deviceOrientation: string;
}

const ProjectSettingDialog = () => {
  const form = useForm({});
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>导出设置</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-8">
              <FormField
                control={form.control}
                name="deviceOrientation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>屏幕方向</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectContent>
                          <SelectItem value="portrait">竖向</SelectItem>
                          <SelectItem value="landscape">横向</SelectItem>
                        </SelectContent>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="output"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>输出目录</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-1">
                        <Input
                          placeholder="小游戏工程输出目录"
                          {...field}
                        ></Input>
                        <Button variant="outline" size="icon">
                          <Folder />
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <div className="flex items-center space-x-4">
                <Label>开启分包设置</Label>
                <Switch></Switch>
              </div>
              <Separator />
              <div className="w-full mt-6"></div>
              <DialogFooter>
                <Button type="submit">保存</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

const ProjectCard = (props: ProjectCardProps) => {
  return (
    <Card key={props.key}>
      <CardHeader className="flex items-center space-x-3">
        <img
          src={`data:image/jpeg;base64,${props.icon}`}
          width={64}
          height={64}
        ></img>
        <CardTitle>{props.name}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
        <CardDescription>Version:{props.version}</CardDescription>
        <CardContent className="mt-4">
          <div className="flex justify-between">
            <Button variant="outline" size="icon">
              <Shuffle />
            </Button>
            <ProjectSettingDialog />
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default ProjectCard;
